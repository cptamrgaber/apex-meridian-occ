'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plane, Users, Calendar, BarChart3, Settings, LogOut, Radio, MapPin, CalendarDays, Bell, Cloud, BookOpen, Shield, Menu, X, UserCog } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', icon: Radio, label: 'Operations' },
    { href: '/chief-pilot', icon: UserCog, label: 'Chief Pilot' },
    { href: '/schedule', icon: CalendarDays, label: 'Schedule' },
    { href: '/roster', icon: Calendar, label: 'Roster' },
    { href: '/om-a-assistant', icon: BookOpen, label: 'OM-A Assistant' },
    { href: '/compliance', icon: Shield, label: 'Compliance' },
    { href: '/notifications', icon: Bell, label: 'Notifications' },
    { href: '/weather', icon: Cloud, label: 'Weather' },
    { href: '/crew', icon: Users, label: 'Crew' },
    { href: '/fleet', icon: Plane, label: 'Fleet' },
    { href: '/fleet-map', icon: MapPin, label: 'Fleet Map' },
    { href: '/routes', icon: MapPin, label: 'Routes' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Fixed at top left */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2.5 bg-white rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-500 transition-all shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-[45] backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-[50]
          w-64 bg-white border-r border-gray-200 flex flex-col shadow-2xl
          transform transition-transform duration-300 ease-in-out backdrop-blur-none
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Logo */}
        <div className="p-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 mb-1">
            <img 
              src="/images/apex-meridian-logo.png" 
              alt="Apex-Meridian" 
              className="h-5"
            />
          </div>
          <p className="text-xs text-gray-600 font-medium">Operations Control Center</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              closeMobileMenu();
              onLogout();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors w-full font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

