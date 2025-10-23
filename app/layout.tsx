export const metadata = {
  title: 'MyILove',
  description: 'App de casal em Next.js',
};

import './globals.css';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="container">
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  );
}
