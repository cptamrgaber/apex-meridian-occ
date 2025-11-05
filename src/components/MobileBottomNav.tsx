'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Calendar, MapPin, BarChart3, Settings } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: Radio, label: 'Operations' },
    { href: '/schedule', icon: Calendar, label: 'Schedule' },
    { href: '/fleet-map', icon: MapPin, label: 'Map' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

