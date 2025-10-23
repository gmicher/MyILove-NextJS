'use client';

import Link from "next/link";
import { Home, Calendar, Heart, FileText, Camera, Map, CheckCircle, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Início", Icon: Home },
  { href: "/eventos", label: "Eventos", Icon: Calendar },
  { href: "/desejos", label: "Desejos", Icon: Heart },
  { href: "/anotacoes", label: "Anotações", Icon: FileText },
  { href: "/fotos", label: "Fotos", Icon: Camera },
  { href: "/viagens", label: "Viagens", Icon: Map },
  { href: "/realizadas", label: "Realizadas", Icon: CheckCircle },
  { href: "/config", label: "Configurações", Icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <nav className="sidebar">
      <h2>MyILove 💕</h2>
      <ul>
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link href={href} className={active ? "active" : ""}>
                <Icon size={20} /> {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
