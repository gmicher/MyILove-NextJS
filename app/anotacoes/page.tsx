'use client';

import { useLocalStorage } from '@/lib/storage';
import { useMemo, useState } from 'react';

type Note = {
  id: number;
  title: string;
  content: string;
  category: 'memories'|'ideas'|'important';
  mood: 'happy'|'love'|'excited'|'peaceful'|'thoughtful';
  createdAt: string;
  updatedAt: string;
};

export default function Page(){
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [filter, setFilter] = useState<'all'|Note['category']>('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<Omit<Note,'id'|'createdAt'|'updatedAt'>>({
    title:'', content:'', category:'memories', mood:'happy'
  });

  const list = useMemo(()=>{
    let arr = notes.slice();
    if(filter!=='all') arr = arr.filter(n=>n.category===filter);
    if(query.trim()){
      const q = query.toLowerCase();
      arr = arr.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }
    return arr;
  }, [notes, filter, query]);

  function submit(e: React.FormEvent){
    e.preventDefault();
    const now = new Date().toISOString();
    const item: Note = { id: Date.now(), ...form, createdAt: now, updatedAt: now };
    setNotes([item, ...notes]);
    setOpen(false);
    setForm({ title:'', content:'', category:'memories', mood:'happy' });
  }
  function del(id:number){
    if(!confirm('Excluir esta anotação?')) return;
    setNotes(notes.filter(n=>n.id!==id));
  }

  return (
    <main className="content">
      <div className="page-header">
        <h2>Anotações 📝</h2>
        <button className="add-btn" onClick={()=>setOpen(true)}>＋ Nova Anotação</button>
      </div>

      <div className="search-bar">
        <input placeholder="Buscar anotações..." value={query} onChange={e=>setQuery(e.target.value)} />
      </div>

      <div className="notes-filter">
        {['all','memories','ideas','important'].map(cat=>(
          <button key={cat} className={'filter-btn ' + (filter===cat? 'active':'')}
            onClick={()=>setFilter(cat as any)}>
            {label(cat as any)}
          </button>
        ))}
      </div>

      <div className="notes-grid" id="notesGrid">
        {list.length ? list.map(note=>(
          <div key={note.id} className="note-card">
            <div className="note-header">
              <div className="note-mood">{moodEmoji(note.mood)}</div>
              <div className="note-category">{categoryIcon(note.category)}</div>
            </div>
            <h4>{note.title}</h4>
            <p className="note-content">{truncate(note.content, 150)}</p>
            <div className="note-footer">
              <span className="note-date">{new Date(note.createdAt).toLocaleDateString('pt-BR')}</span>
              <div className="note-actions">
                <button onClick={()=>del(note.id)} title="Excluir">🗑️</button>
              </div>
            </div>
          </div>
        )) : <p className="empty-state">Nenhuma anotação encontrada. Que tal registrar uma memória especial? 💭</p>}
      </div>

      {open && (
        <div className="modal" style={{display:'flex'}}>
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Nova Anotação</h3>
              <span className="close" onClick={()=>setOpen(false)}>&times;</span>
            </div>
            <form onSubmit={submit}>
              <input type="text" placeholder="Título da anotação" required
                value={form.title} onChange={e=>setForm(s=>({...s,title:e.target.value}))}/>
              <textarea placeholder="Escreva aqui..." required
                value={form.content} onChange={e=>setForm(s=>({...s,content:e.target.value}))}/>
              <div className="form-row">
                <select value={form.category} onChange={e=>setForm(s=>({...s,category:e.target.value as any}))}>
                  <option value="memories">Memórias</option>
                  <option value="ideas">Ideias</option>
                  <option value="important">Importante</option>
                </select>
                <select value={form.mood} onChange={e=>setForm(s=>({...s,mood:e.target.value as any}))}>
                  <option value="happy">😊 Feliz</option>
                  <option value="love">😍 Amor</option>
                  <option value="excited">🤩 Empolgado</option>
                  <option value="peaceful">😌 Tranquilo</option>
                  <option value="thoughtful">🤔 Pensativo</option>
                </select>
              </div>
              <button type="submit" className="submit-btn">Salvar Anotação</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function label(cat: 'all'|'memories'|'ideas'|'important'){
  return cat==='all' ? 'Todas' : cat==='memories' ? 'Memórias' : cat==='ideas' ? 'Ideias' : 'Importante';
}
function moodEmoji(m: Note['mood']) {
  const map: any = { happy:'😊', love:'😍', excited:'🤩', peaceful:'😌', thoughtful:'🤔' };
  return map[m] || '😊';
}
function categoryIcon(c: Note['category']) {
  const map: any = { memories:'💭', ideas:'💡', important:'⭐' };
  return map[c] || '📝';
}
function truncate(t:string, n:number){ return t.length<=n ? t : t.slice(0,n) + '...'; }
