'use client';

import { useLocalStorage } from '@/lib/storage';
import { useEffect, useMemo, useState } from 'react';
import { parseLocalDate } from '@/lib/dates';

type Trip = {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  type: 'romantic'|'adventure'|'relax'|'cultural'|'family';
  budget?: string;
  notes?: string;
  status: 'planned'|'current'|'completed';
  createdAt: string;
};

function durationDays(a: string, b: string){
  const d1 = parseLocalDate(a), d2 = parseLocalDate(b);
  return Math.ceil(Math.abs(+d2 - +d1)/(1000*60*60*24))+1;
}

export default function Page(){
  const [trips, setTrips] = useLocalStorage<Trip[]>('trips', []);
  const [tab, setTab] = useState<'planned'|'current'|'completed'>('planned');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Trip,'id'|'createdAt'|'status'>>({
    destination:'', startDate:'', endDate:'', description:'', type:'romantic', budget:'', notes:''
  });

  // auto-update statuses each mount
  useEffect(()=>{
    const today = new Date();
    let updated = false;
    const nxt = trips.map(t => {
      const s = parseLocalDate(t.startDate);
      const e = parseLocalDate(t.endDate);
      let st: Trip['status'] = 'planned';
      if(today >= s && today <= e) st = 'current';
      else if(today > e) st = 'completed';
      if(st !== t.status) { updated = true; return { ...t, status: st }; }
      return t;
    });
    if(updated) setTrips(nxt);
  }, []); // eslint-disable-line

  const groups = useMemo(()=>{
    return {
      planned: trips.filter(t=>t.status==='planned'),
      current: trips.filter(t=>t.status==='current'),
      completed: trips.filter(t=>t.status==='completed'),
    };
  }, [trips]);

  const stats = useMemo(()=>{
    const totalTrips = trips.length;
    const totalDest = new Set(trips.map(t=>t.destination)).size;
    const totalDays = trips.reduce((s,t)=> s+durationDays(t.startDate, t.endDate), 0);
    return { totalTrips, totalDest, totalDays };
  }, [trips]);

  function submit(e: React.FormEvent){
    e.preventDefault();
    const today = new Date();
    const s = parseLocalDate(form.startDate);
    const e2 = parseLocalDate(form.endDate);
    let status: Trip['status'] = 'planned';
    if(today >= s && today <= e2) status='current';
    else if(today > e2) status='completed';
    const item: Trip = { id: Date.now(), ...form, status, createdAt: new Date().toISOString() };
    setTrips([...trips, item]);
    setOpen(false);
    setForm({ destination:'', startDate:'', endDate:'', description:'', type:'romantic', budget:'', notes:'' });
  }
  function del(id:number){
    if(!confirm('Excluir esta viagem?')) return;
    setTrips(trips.filter(t=>t.id!==id));
  }

  return (
    <main className="content">
      <div className="page-header">
        <h2>Viagens ✈️</h2>
        <button className="add-btn" onClick={()=>setOpen(true)}>＋ Nova Viagem</button>
      </div>

      <div className="trip-stats">
        <div className="stat-item"><span>{stats.totalTrips}</span><p>Total de viagens</p></div>
        <div className="stat-item"><span>{stats.totalDest}</span><p>Destinos</p></div>
        <div className="stat-item"><span>{stats.totalDays}</span><p>Total de dias</p></div>
      </div>

      <div className="trip-tabs">
        {(['planned','current','completed'] as const).map(t=>(
          <button key={t} className={'tab-btn ' + (tab===t? 'active':'')} onClick={()=>setTab(t)}>
            {t==='planned'?'Planejadas':t==='current'?'Em andamento':'Realizadas'}
          </button>
        ))}
      </div>

      {(['planned','current','completed'] as const).map(sec => (
        <section key={sec} className={'trip-section ' + (tab===sec?'active':'')} id={`${sec}Trips`}>
          <div className="trips-grid">
            {groups[sec].length ? groups[sec].map(trip => (
              <div className={'trip-card ' + trip.status} key={trip.id}>
                <div className="trip-header">
                  <div className="trip-type">{typeIcon(trip.type)}</div>
                  <div className="trip-status">{statusBadge(trip.status)}</div>
                </div>
                <h4>{trip.destination}</h4>
                <p className="trip-dates">{new Date(trip.startDate).toLocaleDateString('pt-BR')} - {new Date(trip.endDate).toLocaleDateString('pt-BR')}</p>
                <p className="trip-duration">{durationDays(trip.startDate, trip.endDate)} dias</p>
                {trip.budget ? <p className="trip-budget">💰 {trip.budget}</p> : null}
                {trip.description ? <p className="trip-description">{trip.description.length>80? trip.description.slice(0,80)+'...':trip.description}</p> : null}
                <div className="trip-actions">
                  <button onClick={()=>del(trip.id)} title="Excluir">🗑️</button>
                </div>
              </div>
            )) : <p className="empty-state">Sem itens.</p>}
          </div>
        </section>
      ))}

      {open && (
        <div className="modal" style={{display:'flex'}}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nova Viagem</h3>
              <span className="close" onClick={()=>setOpen(false)}>&times;</span>
            </div>
            <form onSubmit={submit}>
              <input type="text" placeholder="Destino" required
                value={form.destination} onChange={e=>setForm(s=>({...s,destination:e.target.value}))}/>
              <input type="date" required value={form.startDate} onChange={e=>setForm(s=>({...s,startDate:e.target.value}))}/>
              <input type="date" required value={form.endDate} onChange={e=>setForm(s=>({...s,endDate:e.target.value}))}/>
              <textarea placeholder="Descrição (opcional)" value={form.description||''} onChange={e=>setForm(s=>({...s,description:e.target.value}))}/>
              <select value={form.type} onChange={e=>setForm(s=>({...s,type:e.target.value as any}))}>
                <option value="romantic">Romântica</option>
                <option value="adventure">Aventura</option>
                <option value="relax">Relaxante</option>
                <option value="cultural">Cultural</option>
                <option value="family">Família</option>
              </select>
              <input type="text" placeholder="Orçamento (opcional)" value={form.budget||''} onChange={e=>setForm(s=>({...s,budget:e.target.value}))}/>
              <textarea placeholder="Notas (opcional)" value={form.notes||''} onChange={e=>setForm(s=>({...s,notes:e.target.value}))}/>
              <button type="submit" className="submit-btn">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function typeIcon(t: Trip['type']){ const m:any = {romantic:'💕', adventure:'🏔️', relax:'🏖️', cultural:'🏛️', family:'👨‍👩‍👧‍👦'}; return m[t]||'✈️'; }
function statusBadge(s: Trip['status']){ const m:any = {planned:'📅 Planejada', current:'🎒 Em andamento', completed:'✅ Realizada'}; return m[s]||s; }
