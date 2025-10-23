'use client';

import { useEffect, useState } from 'react';

type Settings = {
  theme: 'light'|'dark'|'romantic';
  color: 'pink'|'purple'|'blue'|'green'|'red';
  notifications: { eventReminders:boolean; anniversaryReminders:boolean; achievementCelebrations:boolean; };
  couple: { partner1Name:string; partner2Name:string; relationshipStart:string; description:string; };
  importantDates: { id:number; title:string; date:string; type:'anniversary'|'first'|'special' }[];
};

const DEFAULT: Settings = {
  theme: 'light',
  color: 'pink',
  notifications: { eventReminders:false, anniversaryReminders:false, achievementCelebrations:false },
  couple: { partner1Name:'', partner2Name:'', relationshipStart:'', description:'' },
  importantDates: []
};

export default function Page(){
  const [settings, setSettings] = useState<Settings>(DEFAULT);

  useEffect(()=>{
    try {
      const raw = localStorage.getItem('myilove_settings');
      setSettings(raw? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT);
    } catch { setSettings(DEFAULT); }
  }, []);

  useEffect(()=>{
    try { localStorage.setItem('myilove_settings', JSON.stringify(settings)); } catch {}
    applyTheme(settings);
  }, [settings]);

  function addImportantDate(){
    const title = prompt('Nome da data (ex: Primeiro encontro)');
    const date = prompt('Data (YYYY-MM-DD)');
    const type = (prompt('Tipo (anniversary, first, special)') || 'special') as any;
    if(!title || !date) return;
    setSettings(s=> ({...s, importantDates:[...s.importantDates, { id: Date.now(), title, date, type }]}));
  }
  function rmImportantDate(id:number){
    setSettings(s=> ({...s, importantDates: s.importantDates.filter(d=>d.id!==id)}));
  }

  return (
    <main className="content">
      <h2>Configurações ⚙️</h2>

      <div className="config-section">
        <div className="card">
          <h3>Perfil do Casal</h3>
          <form onSubmit={(e)=>{e.preventDefault();}}>
            <div className="form-row">
              <input placeholder="Nome do primeiro parceiro" value={settings.couple.partner1Name} onChange={e=>setSettings(s=>({...s, couple:{...s.couple, partner1Name:e.target.value}}))}/>
              <input placeholder="Nome do segundo parceiro" value={settings.couple.partner2Name} onChange={e=>setSettings(s=>({...s, couple:{...s.couple, partner2Name:e.target.value}}))}/>
            </div>
            <input type="date" value={settings.couple.relationshipStart} onChange={e=>setSettings(s=>({...s, couple:{...s.couple, relationshipStart:e.target.value}}))}/>
            <textarea placeholder="Conte um pouco sobre vocês..." value={settings.couple.description} onChange={e=>setSettings(s=>({...s, couple:{...s.couple, description:e.target.value}}))}/>
          </form>
        </div>
      </div>

      <div className="config-section">
        <div className="card">
          <h3>Notificações</h3>
          <div className="setting-item">
            <label><input type="checkbox" checked={settings.notifications.eventReminders} onChange={e=>setSettings(s=>({...s, notifications:{...s.notifications, eventReminders:e.target.checked}}))}/> Lembrar de eventos próximos</label>
          </div>
          <div className="setting-item">
            <label><input type="checkbox" checked={settings.notifications.anniversaryReminders} onChange={e=>setSettings(s=>({...s, notifications:{...s.notifications, anniversaryReminders:e.target.checked}}))}/> Lembrar de aniversários importantes</label>
          </div>
          <div className="setting-item">
            <label><input type="checkbox" checked={settings.notifications.achievementCelebrations} onChange={e=>setSettings(s=>({...s, notifications:{...s.notifications, achievementCelebrations:e.target.checked}}))}/> Celebrar conquistas realizadas</label>
          </div>
        </div>
      </div>

      <div className="config-section">
        <div className="card">
          <h3>Aparência</h3>
          <div className="setting-item">
            <label>Tema:&nbsp;</label>
            <select value={settings.theme} onChange={e=>setSettings(s=>({...s, theme: e.target.value as any}))}>
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
              <option value="romantic">Romântico</option>
            </select>
          </div>
          <div className="color-palette">
            <h4>Cor principal:</h4>
            <div className="color-options">
              {(['pink','purple','blue','green','red'] as const).map(c=>(
                <div key={c} className={'color-option ' + c + (settings.color===c? ' active':'')} data-color={c}
                  onClick={()=>setSettings(s=>({...s, color:c}))}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="config-section">
        <div className="card">
          <h3>Datas Importantes</h3>
          <div id="importantDates">
            {settings.importantDates.length? settings.importantDates.map(d => (
              <div key={d.id} className="date-item">
                <div><strong>{d.title}</strong><p>{formatBR(d.date)} • {label(d.type)}</p></div>
                <button className="clear-btn small" onClick={()=>rmImportantDate(d.id)}>&times;</button>
              </div>
            )) : <p className="empty-state">Nenhuma data importante cadastrada.</p>}
          </div>
          <button className="add-btn" onClick={addImportantDate}>＋ Adicionar Data</button>
        </div>
      </div>
    </main>
  );
}

function formatBR(iso: string){ try { const d = new Date(iso); return d.toLocaleDateString('pt-BR'); } catch { return iso; } }
function label(t:'anniversary'|'first'|'special'){ return t==='anniversary'?'Aniversário': t==='first'?'Primeira vez':'Data especial'; }

function applyTheme(settings: any){
  const root = document.documentElement as any;
  const ACCENT: any = { pink:'#ff4fa0', purple:'#7a3cff', blue:'#4da3ff', green:'#34c759', red:'#ff3b30' };
  if(settings.theme==='light'){ root.style.setProperty('--bg','#faf9fb'); root.style.setProperty('--card','#ffffff'); root.style.setProperty('--text','#333333'); root.style.setProperty('--line','#eee'); }
  else if(settings.theme==='dark'){ root.style.setProperty('--bg','#0f0f12'); root.style.setProperty('--card','#15151a'); root.style.setProperty('--text','#f2f2f2'); root.style.setProperty('--line','#2a2a31'); }
  else { root.style.setProperty('--bg','#fff4f8'); root.style.setProperty('--card','#ffffff'); root.style.setProperty('--text','#3a2b34'); root.style.setProperty('--line','#ffd6e8'); }
  root.style.setProperty('--purple', ACCENT[settings.color] || ACCENT.pink);
}
