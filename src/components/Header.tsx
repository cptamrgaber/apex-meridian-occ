'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Plane, Users, Calendar, BarChart3, Settings, LogOut, Radio, MapPin, 
  CalendarDays, Bell, Cloud, BookOpen, Shield, UserCog, ChevronDown 
} from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

interface NavItem {
  label: string;
  href?: string;
  icon: any;
  subItems?: { label: string; href: string; icon: any }[];
}

export default function Header({ onLogout }: HeaderProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems: NavItem[] = [
    {
      label: 'Operations',
      icon: Radio,
      subItems: [
        { label: 'Dashboard', href: '/dashboard', icon: Radio },
        { label: 'Chief Pilot', href: '/chief-pilot', icon: UserCog },
        { label: 'Notifications', href: '/notifications', icon: Bell },
      ]
    },
    {
      label: 'Planning',
      icon: Calendar,
      subItems: [
        { label: 'Schedule', href: '/schedule', icon: CalendarDays },
        { label: 'Roster', href: '/roster', icon: Calendar },
      ]
    },
    {
      label: 'Resources',
      icon: Plane,
      subItems: [
        { label: 'Crew', href: '/crew', icon: Users },
        { label: 'Fleet', href: '/fleet', icon: Plane },
        { label: 'Fleet Map', href: '/fleet-map', icon: MapPin },
        { label: 'Routes', href: '/routes', icon: MapPin },
      ]
    },
    {
      label: 'Tools',
      icon: BookOpen,
      subItems: [
        { label: 'OM-A Assistant', href: '/om-a-assistant', icon: BookOpen },
        { label: 'Weather', href: '/weather', icon: Cloud },
        { label: 'Compliance', href: '/compliance', icon: Shield },
        { label: 'Analytics', href: '/analytics', icon: BarChart3 },
      ]
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
    }
  ];

  const handleMouseEnter = (label: string) => {
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  const isActiveSection = (item: NavItem) => {
    if (item.href && pathname === item.href) return true;
    if (item.subItems) {
      return item.subItems.some(sub => pathname === sub.href);
    }
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/images/apex-meridian-logo.png" 
              alt="Apex-Meridian" 
              className="h-8 w-auto max-w-[160px]"
            />
            <div className="hidden lg:block border-l border-gray-300 pl-3">
              <p className="text-sm text-gray-600 font-medium leading-tight">Operations Control Center</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveSection(item);
              
              // Simple link (no dropdown)
              if (!item.subItems && item.href) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              }

              // Dropdown menu
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === item.label && item.subItems && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = pathname === subItem.href;
                        
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`
                              flex items-center gap-3 px-4 py-2.5 transition-colors
                              ${isSubActive 
                                ? 'bg-blue-50 text-blue-600 font-medium' 
                                : 'text-gray-700 hover:bg-gray-50'
                              }
                            `}
                          >
                            <SubIcon className="w-4 h-4" />
                            <span>{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Simple dropdown for now */}
      <div className="md:hidden border-t border-gray-200 bg-gray-50">
        <div className="max-w-[1920px] mx-auto px-4 py-2">
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={pathname}
            onChange={(e) => window.location.href = e.target.value}
          >
            <option value="">Navigate to...</option>
            {navItems.map((item) => {
              if (item.subItems) {
                return (
                  <optgroup key={item.label} label={item.label}>
                    {item.subItems.map((sub) => (
                      <option key={sub.href} value={sub.href}>
                        {sub.label}
                      </option>
                    ))}
                  </optgroup>
                );
              } else if (item.href) {
                return (
                  <option key={item.href} value={item.href}>
                    {item.label}
                  </option>
                );
              }
              return null;
            })}
          </select>
        </div>
      </div>
    </header>
  );
}

