'use client';

import { useLocalStorage } from '@/lib/storage';
import { useMemo, useState } from 'react';

type Wish = {
  id: number;
  title: string;
  description?: string;
  category: 'places'|'experiences'|'gifts'|'goals';
  priority: 'low'|'medium'|'high';
  estimate?: string;
  completed?: boolean;
  createdAt: string;
  completedAt?: string;
};

export default function Page(){
  const [wishes, setWishes] = useLocalStorage<Wish[]>('wishes', []);
  const [completed, setCompleted] = useLocalStorage<Wish[]>('completed', []);
  const [filter, setFilter] = useState<'all'|Wish['category']>('all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Wish,'id'|'createdAt'>>({
    title:'', description:'', category:'places', priority:'medium', estimate:'', completed:false
  });

  const list = useMemo(()=>{
    return (filter==='all'? wishes : wishes.filter(w=>w.category===filter));
  }, [wishes, filter]);

  function submit(e: React.FormEvent){
    e.preventDefault();
    const item: Wish = { id: Date.now(), ...form, createdAt: new Date().toISOString() };
    setWishes([...wishes, item]);
    setOpen(false);
    setForm({ title:'', description:'', category:'places', priority:'medium', estimate:'', completed:false });
  }
  function markDone(id: number){
    const w = wishes.find(x=>x.id===id);
    if(!w) return;
    const done = { ...w, completed:true, completedAt: new Date().toISOString() };
    setCompleted([...completed, done]);
    setWishes(wishes.filter(x=>x.id!==id));
  }
  function del(id:number){
    if(!confirm('Excluir este desejo?')) return;
    setWishes(wishes.filter(x=>x.id!==id));
  }

  return (
    <main className="content">
      <div className="page-header">
        <h2>Lista de Desejos 💖</h2>
        <button className="add-btn" onClick={()=>setOpen(true)}>＋ Adicionar Desejo</button>
      </div>

      <div className="wish-categories">
        <div className="category-filter">
          {(['all','places','experiences','gifts','goals'] as const).map(cat=>(
            <button key={cat} className={'filter-btn ' + (filter===cat? 'active':'')} onClick={()=>setFilter(cat)}>
              {label(cat)}
            </button>
          ))}
        </div>
      </div>

      <div className="wishes-grid" id="wishesGrid">
        {list.length ? list.map(wish => (
          <div className={`wish-card ${wish.priority}`} key={wish.id}>
            <div className="wish-header">
              <div className="wish-category">{catIcon(wish.category)}</div>
              <div className="wish-priority">{prioIcon(wish.priority)}</div>
            </div>
            <h4>{wish.title}</h4>
            {wish.description ? <p className="wish-description">{wish.description}</p> : null}
            {wish.estimate ? <p className="wish-estimate">💰 {wish.estimate}</p> : null}
            <div className="wish-actions">
              <button className="complete-btn" onClick={()=>markDone(wish.id)} title="Marcar como realizado">✔️</button>
              <button className="delete-btn" onClick={()=>del(wish.id)} title="Excluir">🗑️</button>
            </div>
          </div>
        )) : <p className="empty-state">Nenhum desejo encontrado. Que tal sonhar um pouco? ✨</p>}
      </div>

      {open && (
        <div className="modal" style={{display:'flex'}}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Novo Desejo</h3>
              <span className="close" onClick={()=>setOpen(false)}>&times;</span>
            </div>
            <form onSubmit={submit}>
              <input type="text" placeholder="O que vocês desejam?" required
                value={form.title} onChange={e=>setForm(s=>({...s,title:e.target.value}))} />
              <textarea placeholder="Descreva esse sonho..." value={form.description}
                onChange={e=>setForm(s=>({...s,description:e.target.value}))}/>
              <select value={form.category} onChange={e=>setForm(s=>({...s,category:e.target.value as any}))}>
                <option value="places">Lugares para visitar</option>
                <option value="experiences">Experiências</option>
                <option value="gifts">Presentes</option>
                <option value="goals">Objetivos do casal</option>
              </select>
              <select value={form.priority} onChange={e=>setForm(s=>({...s,priority:e.target.value as any}))}>
                <option value="low">Baixa prioridade</option>
                <option value="medium">Média prioridade</option>
                <option value="high">Alta prioridade</option>
              </select>
              <input type="text" placeholder="Estimativa de custo (opcional)" value={form.estimate}
                onChange={e=>setForm(s=>({...s,estimate:e.target.value}))}/>
              <button type="submit" className="submit-btn">Adicionar Desejo</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function label(cat: 'all'|'places'|'experiences'|'gifts'|'goals'){
  return cat==='all' ? 'Todos' :
    cat==='places' ? 'Lugares' :
    cat==='experiences' ? 'Experiências' :
    cat==='gifts' ? 'Presentes' : 'Objetivos';
}
function catIcon(c: Wish['category']){ const m:any = {places:'🗺️', experiences:'🎭', gifts:'🎁', goals:'🎯'}; return m[c]||'💫'; }
function prioIcon(p: Wish['priority']){ const m:any = {low:'🔵', medium:'🟡', high:'🔴'}; return m[p]||'🔵'; }
