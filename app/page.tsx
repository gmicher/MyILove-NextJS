'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [counts, setCounts] = useState({
    eventos: 0, desejos: 0, anotacoes: 0, fotos: 0, viagens: 0, realizadas: 0
  });

  useEffect(() => {
    const safeParse = (key: string) => {
      try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
    };
    const events = safeParse('events');
    const wishes = safeParse('wishes');
    const notes = safeParse('notes');
    const photos = safeParse('photos');
    const trips  = safeParse('trips');
    const completed = safeParse('completed');

    setCounts({
      eventos: events.length,
      desejos: wishes.length,
      anotacoes: notes.length,
      fotos: photos.length,
      viagens: trips.length,
      realizadas: completed.length
    });
  }, []);

  return (
    <main className="content dashboard">
      <div className="welcome-card">
        <h2>Bem-vindos ao MyILove 💖</h2>
        <p>Seu espaço especial para planejar e registrar momentos únicos juntos.</p>
      </div>

      <div className="stats">
        <div className="stat-card"><span>{counts.eventos}</span><p>Eventos</p></div>
        <div className="stat-card"><span>{counts.desejos}</span><p>Desejos</p></div>
        <div className="stat-card"><span>{counts.anotacoes}</span><p>Anotações</p></div>
        <div className="stat-card"><span>{counts.fotos}</span><p>Fotos</p></div>
        <div className="stat-card"><span>{counts.viagens}</span><p>Viagens</p></div>
        <div className="stat-card"><span>{counts.realizadas}</span><p>Realizadas</p></div>
      </div>

      <div className="quick-actions">
        <h3>Ações Rápidas</h3>
        <div className="buttons">
          <a className="blue" href="/eventos"><i /> Novo Evento</a>
          <a className="pink" href="/desejos"><i /> Adicionar Desejo</a>
          <a className="purple" href="/anotacoes"><i /> Nova Anotação</a>
          <a className="green" href="/fotos"><i /> Adicionar Foto</a>
        </div>
      </div>

      <div className="next-events">
        <h3>Próximos Eventos</h3>
        <p>Abra a seção <a href="/eventos">Eventos</a> para cadastrar seus planos 💐</p>
      </div>
    </main>
  );
}
