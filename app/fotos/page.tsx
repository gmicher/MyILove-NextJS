'use client';

import { useLocalStorage } from '@/lib/storage';
import { useMemo, useRef, useState } from 'react';

type Photo = {
  id: number;
  title: string;
  description?: string;
  date: string;
  category: 'selfie'|'date'|'travel'|'special';
  location?: string;
  image: string; // data URL
  isFavorite?: boolean;
  createdAt: string;
};

export default function Page(){
  const [photos, setPhotos] = useLocalStorage<Photo[]>('photos', []);
  const [filter, setFilter] = useState<'all'|'favorites'|Photo['category']>('all');
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState<Omit<Photo,'id'|'createdAt'>>({
    title:'', description:'', date: new Date().toISOString().split('T')[0],
    category:'selfie', location:'', image:'', isFavorite:false
  });

  const fileRef = useRef<HTMLInputElement>(null);

  const list = useMemo(()=>{
    let arr = photos.slice();
    if(filter==='favorites') arr = arr.filter(p=>p.isFavorite);
    else if(filter!=='all') arr = arr.filter(p=>p.category===filter);
    return arr;
  }, [photos, filter]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0];
    if(!file) return;
    const rd = new FileReader();
    rd.onload = (ev)=> setForm(s=>({...s, image: String(ev.target?.result||'')}));
    rd.readAsDataURL(file);
  }

  function submit(e: React.FormEvent){
    e.preventDefault();
    if(!form.image){ alert('Selecione uma imagem'); return; }
    const item: Photo = { id: Date.now(), ...form, createdAt: new Date().toISOString() };
    setPhotos([item, ...photos]);
    setOpen(false);
    setForm({ title:'', description:'', date: new Date().toISOString().split('T')[0], category:'selfie', location:'', image:'', isFavorite:false });
    if(fileRef.current) fileRef.current.value='';
  }

  function toggleFav(id:number){
    setPhotos(photos.map(p=> p.id===id ? {...p, isFavorite: !p.isFavorite} : p));
  }
  function del(id:number){
    if(!confirm('Excluir esta foto?')) return;
    setPhotos(photos.filter(p=>p.id!==id));
  }

  return (
    <main className="content">
      <div className="page-header">
        <h2>Galeria de Fotos 📸</h2>
        <button className="add-btn" onClick={()=>setOpen(true)}>＋ Adicionar Foto</button>
      </div>

      <div className="gallery-stats">
        <div className="stat-item"><span>{photos.length}</span><p>Total de fotos</p></div>
        <div className="stat-item"><span>{new Set(photos.map(p=>p.category)).size}</span><p>Álbuns</p></div>
        <div className="stat-item"><span>{photos.filter(p=>p.isFavorite).length}</span><p>Favoritas</p></div>
      </div>

      <div className="gallery-filter">
        {(['all','selfie','date','travel','special','favorites'] as const).map(cat=>(
          <button key={cat} className={'filter-btn ' + (filter===cat? 'active':'')}
            onClick={()=>setFilter(cat as any)}>
            {label(cat as any)}
          </button>
        ))}
      </div>

      <div className="photos-grid" id="photosGrid">
        {list.length ? list.map(photo=>(
          <div className="photo-item" key={photo.id}>
            <div className="photo-image">
              <img src={photo.image} alt={photo.title}/>
              <div className="photo-overlay">
                <div className="photo-actions">
                  <button className={'favorite-btn ' + (photo.isFavorite? 'active':'')} onClick={()=>toggleFav(photo.id)}>❤️</button>
                  <button className="delete-btn" onClick={()=>del(photo.id)}>🗑️</button>
                </div>
              </div>
            </div>
            <div className="photo-info">
              <h4>{photo.title}</h4>
              <p className="photo-date">{new Date(photo.date).toLocaleDateString('pt-BR')}</p>
              {photo.location ? <p className="photo-location">📍 {photo.location}</p> : null}
            </div>
          </div>
        )) : (
          <div className="photo-placeholder">
            <p>Nenhuma foto encontrada</p>
            <span>Comece a criar memórias visuais do seu amor! 💕</span>
          </div>
        )}
      </div>

      {open && (
        <div className="modal" style={{display:'flex'}}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Adicionar Foto</h3>
              <span className="close" onClick={()=>setOpen(false)}>&times;</span>
            </div>
            <form onSubmit={submit}>
              <div className="photo-upload">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} />
              </div>
              <input type="text" placeholder="Título da foto" required
                value={form.title} onChange={e=>setForm(s=>({...s,title:e.target.value}))}/>
              <textarea placeholder="Descrição..." value={form.description}
                onChange={e=>setForm(s=>({...s,description:e.target.value}))}/>
              <input type="date" required value={form.date} onChange={e=>setForm(s=>({...s,date:e.target.value}))}/>
              <select required value={form.category} onChange={e=>setForm(s=>({...s,category:e.target.value as any}))}>
                <option value="selfie">Selfie</option>
                <option value="date">Encontro</option>
                <option value="travel">Viagem</option>
                <option value="special">Momento especial</option>
              </select>
              <input type="text" placeholder="Local (opcional)" value={form.location}
                onChange={e=>setForm(s=>({...s,location:e.target.value}))}/>
              <button type="submit" className="submit-btn">Adicionar Foto</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function label(x: 'all'|'selfie'|'date'|'travel'|'special'|'favorites'){
  const m:any = { all:'Todas', selfie:'Selfies', date:'Encontros', travel:'Viagens', special:'Especiais', favorites:'Favoritas' };
  return m[x] || x;
}
