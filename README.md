Evolução e Migração para React/Next.js

Com o avanço do projeto e a necessidade de melhorar o desempenho e a organização do código, o MyILove foi migrado para o framework Next.js (React 19 e Next.js 15), que trouxe uma estrutura mais moderna, componentizada e fácil de manter.

Essa migração permite que o sistema seja mais escalável, modular e performático, além de abrir espaço pra futuras integrações, como autenticação, banco de dados e APIs.

Vantagens da Migração

A transição do modelo baseado em HTML/CSS/JS puro para React e Next.js trouxe benefícios técnicos e de experiência do usuário:

Componentização: agora cada parte da interface (botões, cards, listas, modais) é um componente React reutilizável.

Performance: renderização otimizada no servidor com React Server Components.

Organização: estrutura de pastas padronizada (app, components, lib, etc).

Facilidade de manutenção: código dividido por responsabilidades, reduzindo repetição.

Escalabilidade: o sistema pode crescer sem comprometer o desempenho.

UX aprimorada: carregamentos mais rápidos, navegação fluida e visual mais moderno.

<img width="681" height="274" alt="Captura de tela 2025-10-23 192402" src="https://github.com/user-attachments/assets/bf1ec963-2c9b-470b-9a4a-d1ae84ceb9a3" />


Protótipos e Ideação Visual

Durante a migração, os protótipos foram mantidos com base no design inicial do MyILove, priorizando:

cores suaves e românticas, representando o tema do casal;

cards e modais com cantos arredondados e sombras leves;

layout responsivo compatível com desktop e mobile;

navegação lateral (sidebar) simplificada, mantendo a identidade original.

Os protótipos foram usados como referência para reimplementar as páginas com componentes React reutilizáveis, mantendo a experiência do usuário fiel à proposta original.

Exemplos de Código (React/Next.js)
Componente de Botão
// src/components/Button.tsx
"use client";

interface ButtonProps {
  label: string;
  onClick?: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow-md transition"
    >
      {label}
    </button>
  );
}


Esse botão substitui o antigo .add-btn do CSS, agora como componente reutilizável e estilizado com Tailwind.

Página de Viagens
// src/app/viagens/page.tsx
import { Button } from "@/components/Button";

export default function ViagensPage() {
  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-pink-600">Nossas Viagens</h2>
        <Button label="+ Nova Viagem" onClick={() => console.log("Abrir modal")} />
      </div>
      <p className="text-gray-500">Nenhuma viagem cadastrada ainda.</p>
    </section>
  );
}


Essa página substitui a antiga viagens.html, agora com componentes dinâmicos e renderização otimizada.

Como Rodar o Projeto
# Instalar dependências
npm install

# Rodar o ambiente de desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar o servidor de produção
npm start


A aplicação usa Next.js 15 com React 19, TypeScript e Tailwind CSS.
Por padrão, roda em http://localhost:3000
.

Caráter Extensionista (Nova Versão)

O caráter extensionista foi ampliado na migração.
Além da proposta original de inclusão digital e bem-estar emocional, agora:

o sistema pode ser hospedado online e compartilhado com outros casais;

há possibilidade de expansão para apps móveis via React Native;

a estrutura com Server Actions permite integração futura com bancos de dados e login;

reforça o aprendizado prático em tecnologias de ponta e acessíveis.

 Aprendizados da Nova Etapa

Experiência com Next.js, React e componentização moderna.

Aprendizado de arquitetura front-end escalável.

Implementação de Tailwind CSS e padrões visuais consistentes.

Entendimento de Server Components, rotas dinâmicas e deploy.

Prática de migração de projetos legados (HTML/JS → React).

 Resumo: o MyILove evoluiu de um projeto estático para um sistema dinâmico e moderno, mantendo sua essência romântica e intuitiva, mas agora com uma base sólida para o futuro.
