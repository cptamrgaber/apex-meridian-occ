'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plane, Users, Calendar, BarChart3, Settings, LogOut, Radio, MapPin, CalendarDays, Bell, Cloud } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: Radio, label: 'Operations' },
    { href: '/schedule', icon: CalendarDays, label: 'Schedule' },
    { href: '/roster', icon: Calendar, label: 'Roster' },
    { href: '/notifications', icon: Bell, label: 'Notifications' },
    { href: '/weather', icon: Cloud, label: 'Weather' },
    { href: '/crew', icon: Users, label: 'Crew' },
    { href: '/fleet', icon: Plane, label: 'Fleet' },
    { href: '/routes', icon: MapPin, label: 'Routes' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Plane className="w-8 h-8 text-sky-400" />
          <div>
            <h1 className="text-xl font-bold text-white">Apex Meridian</h1>
            <p className="text-xs text-slate-400">Operations Control</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

