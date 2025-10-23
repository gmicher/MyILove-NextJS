'use client';

import { useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/lib/storage';
import { parseLocalDate } from '@/lib/dates';

type Wish = { id:number; title:string; description?:string; category?:string; priority?: 'low'|'medium'|'high'; completedAt?:string; };
type EventItem = { id:number; title:string; date:string; description?:string; category?:string; };
type Trip = { id:number; destination:string; endDate:string; status:string; description?:string; };

export default function Page(){
  const [completed, setCompleted] = useLocalStorage<any[]>('completed', []);
  const [events] = useLocalStorage<EventItem[]>('events', []);
  const [trips] = useLocalStorage<Trip[]>('trips', []);

  useEffect(()=>{
    // Merge all completed items into local completed timeline
    const pastEvents = events.filter(e => parseLocalDate(e.date) < new Date()).map(e => ({
      id: e.id, title: e.title, description: e.description, completedAt: e.date, type: 'event', category: e.category
    }));
    const doneTrips = trips.filter(t => t.status === 'completed').map(t => ({
      id: t.id, title: `Viagem para ${t.destination}`, description: t.description, completedAt: t.endDate, type: 'trip'
    }));
    const base = (Array.isArray(completed)? completed : []).filter(x=>x && 'completedAt' in x);
    const merged = [...base, ...pastEvents, ...doneTrips]
      .sort((a,b)=> new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    setCompleted(merged);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(()=>{
    const now = new Date();
    const month = completed.filter(i => {
      const d = new Date(i.completedAt); return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
    }).length;
    const year = completed.filter(i => {
      const d = new Date(i.completedAt); return d.getFullYear()===now.getFullYear();
    }).length;
    const score = completed.reduce((s,i)=> s + scoreOf(i), 0);
    return { total: completed.length, month, year, score };
  }, [completed]);

  return (
    <main className="content">
      <div className="page-header">
        <h2>Conquistas Realizadas ✨</h2>
        <div className="achievement-counter"><span>{stats.total}</span> conquistas</div>
      </div>

      <div className="achievements-stats">
        <div className="stat-item"><span>{stats.month}</span><p>Este mês</p></div>
        <div className="stat-item"><span>{stats.year}</span><p>Este ano</p></div>
        <div className="stat-item"><span>{stats.score}</span><p>Pontos de amor</p></div>
      </div>

      <div className="recent-achievements">
        <h3>Conquistas Recentes</h3>
        <div id="recentList" className="achievements-list">
          {completed.length ? completed.slice(0, 10).map(i => (
            <div className="achievement-item" key={`${i.type}-${i.id}`}>
              <div className="achievement-icon">{iconOf(i)}</div>
              <div className="achievement-details">
                <h4>{i.title}</h4>
                <p className="achievement-date">{new Date(i.completedAt).toLocaleDateString('pt-BR')}</p>
                <span className="achievement-score">+{scoreOf(i)} pontos</span>
              </div>
            </div>
          )) : <p className="empty-state">Nenhuma conquista recente.</p>}
        </div>
      </div>
    </main>
  );
}

function iconOf(i:any){ if(i.type==='trip') return '✈️'; if(i.type==='event') return '🎉';
  const m:any = { places:'🗺️', experiences:'🎭', gifts:'🎁', goals:'🎯' }; return m[i.category] || '⭐'; }
function scoreOf(i:any){ if(i.type==='trip') return 50; if(i.type==='event') return 20;
  return i.priority==='high'?30 : i.priority==='medium'?20 : 10; }
