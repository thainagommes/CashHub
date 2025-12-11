'use client';

import { Home, Plus, BarChart3, Settings, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/transactions', icon: Plus, label: 'Transações' },
  { href: '/reports', icon: BarChart3, label: 'Relatórios' },
  { href: '/alerts', icon: AlertTriangle, label: 'Alertas' },
  { href: '/settings', icon: Settings, label: 'Configurações' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:top-0 md:bottom-auto md:left-0 md:w-64 md:h-screen md:border-t-0 md:border-r">
      <div className="flex md:flex-col justify-around md:justify-start md:pt-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col md:flex-row items-center justify-center md:justify-start p-3 md:px-6 md:py-3 text-gray-600 hover:text-blue-800 transition-colors',
                isActive && 'text-blue-800 bg-blue-50 md:bg-blue-100'
              )}
            >
              <item.icon className="w-6 h-6 md:mr-3" />
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}