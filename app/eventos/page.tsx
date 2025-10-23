'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '@/lib/storage';
import { parseLocalDate, formatBR } from '@/lib/dates';

type EventItem = {
  id: number;
  title: string;
  date: string; // ISO 'YYYY-MM-DD'
  time?: string;
  description?: string;
  category?: 'date' | 'anniversary' | 'travel' | 'special';
};

const daysOfWeek = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

export default function Page() {
  const [events, setEvents] = useLocalStorage<EventItem[]>('events', []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const monthLabel = useMemo(() => {
    const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }, [currentDate]);

  const calendarCells = useMemo(()=>{
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const start = new Date(firstDay);
    start.setDate(start.getDate() - firstDay.getDay());
    return Array.from({length: 42}, (_,i)=>{
      const dt = new Date(start);
      dt.setDate(start.getDate()+i);
      const isOther = dt.getMonth() !== currentDate.getMonth();
      const isToday = dt.toDateString() === new Date().toDateString();
      const hasEvent = events.some(ev => parseLocalDate(ev.date).toDateString() === dt.toDateString());
      return { dt, isOther, isToday, hasEvent };
    });
  }, [currentDate, events]);

  const [form, setForm] = useState<EventItem>({
    id: 0, title: '', date: '', time: '', description: '', category: 'date'
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const item: EventItem = { ...form, id: Date.now() };
    setEvents([...events, item]);
    setOpen(false);
    setForm({ id:0, title:'', date:'', time:'', description:'', category:'date' });
  }

  function del(id: number) {
    if (!confirm('Excluir este evento?')) return;
    setEvents(events.filter(e => e.id !== id));
  }

  const upcoming = useMemo(()=>{
    const t0 = new Date(); t0.setHours(0,0,0,0);
    return events.map(ev=>({ ...ev, _d: parseLocalDate(ev.date) }))
      .filter(ev => !isNaN(ev._d as any))
      .sort((a,b)=> (a._d as any) - (b._d as any))
      .filter(ev => (ev._d as any) >= t0)
  }, [events]);

  return (
    <main className="content">
      <div className="page-header">
        <h2>Eventos 📅</h2>
        <button className="add-btn" onClick={()=>setOpen(true)}>
          <span>＋</span> Adicionar Evento
        </button>
      </div>

      <div className="calendar-view">
        <div className="calendar-header">
          <button onClick={()=>setCurrentDate(d => new Date(d.getFullYear(), d.getMonth()-1, 1))}>‹</button>
          <h3 id="currentMonth">{monthLabel}</h3>
          <button onClick={()=>setCurrentDate(d => new Date(d.getFullYear(), d.getMonth()+1, 1))}>›</button>
        </div>
        <div className="calendar-grid">
          {daysOfWeek.map(d => <div key={d} className="calendar-day-header">{d}</div>)}
          {calendarCells.map(({dt,isOther,isToday,hasEvent})=>{
            const cls = [
              'calendar-day',
              isOther ? 'other-month' : '',
              isToday ? 'today' : '',
              hasEvent ? 'has-event' : ''
            ].join(' ').trim();
            return <div key={dt.toISOString()} className={cls}>{dt.getDate()}</div>;
          })}
        </div>
      </div>

      <div className="events-list">
        <h3>Próximos Eventos</h3>
        <div id="eventsList">
          {upcoming.length ? upcoming.map(ev => (
            <div className="event-item" key={ev.id}>
              <div className="event-icon">{iconOf(ev.category)}</div>
              <div className="event-details">
                <h4>{ev.title}</h4>
                <p className="event-date">{formatBR(parseLocalDate(ev.date))} {ev.time ? `às ${ev.time}` : ''}</p>
                {ev.description ? <p className="event-description">{ev.description}</p> : null}
              </div>
              <button className="delete-btn" onClick={()=>del(ev.id)}>🗑️</button>
            </div>
          )) : <p className="empty-state">Nenhum evento para exibir.</p>}
        </div>
      </div>

      {open && (
        <div className="modal" style={{display:'flex'}}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Novo Evento</h3>
              <span className="close" onClick={()=>setOpen(false)}>&times;</span>
            </div>
            <form onSubmit={submit}>
              <input type="text" placeholder="Título do evento" required
                value={form.title} onChange={e=>setForm(s=>({...s,title:e.target.value}))}/>
              <input type="date" required
                value={form.date} onChange={e=>setForm(s=>({...s,date:e.target.value}))}/>
              <input type="time" value={form.time} onChange={e=>setForm(s=>({...s,time:e.target.value}))}/>
              <textarea placeholder="Descrição (opcional)"
                value={form.description} onChange={e=>setForm(s=>({...s,description:e.target.value}))}/>
              <select value={form.category} onChange={e=>setForm(s=>({...s,category:e.target.value as any}))}>
                <option value="date">Encontro</option>
                <option value="anniversary">Aniversário</option>
                <option value="travel">Viagem</option>
                <option value="special">Especial</option>
              </select>
              <button type="submit" className="submit-btn">Adicionar</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function iconOf(cat?: EventItem['category']) {
  const map: Record<string,string> = { date:'💕', anniversary:'🎉', travel:'✈️', special:'⭐' };
  return map[cat||''] || '📅';
}
