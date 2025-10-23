'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  function submit(e: React.FormEvent){
    e.preventDefault();
    if(!email.includes('@')) return setMsg('Por favor, insira um e-mail válido');
    if(password.length < 6) return setMsg('A senha deve ter pelo menos 6 caracteres');
    setMsg('Login realizado com sucesso!');
    setTimeout(()=> router.push('/'), 700);
  }

  return (
    <main className="content" style={{maxWidth: 480, margin: '0 auto'}}>
      <div className="card">
        <h2 style={{textAlign:'center'}}>CoupleConnect</h2>
        <p className="subtitle" style={{textAlign:'center'}}>Conecte-se com seu amor</p>
        <form onSubmit={submit}>
          <input type="email" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <input type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} required/>
          <button className="login-button submit-btn" type="submit">Entrar</button>
          {msg && <div className="success-message" style={{marginTop:10}}>{msg}</div>}
        </form>
      </div>
    </main>
  );
}
