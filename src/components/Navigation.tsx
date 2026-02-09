'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from './ThemeSwitcher';

export default function Navigation() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Dashboard', href: '/' },
    { name: 'Docs', href: '/docs' },
    { name: 'Log', href: '/log' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 border-b border-border bg-card h-16 flex items-center px-6 z-50">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-xl font-bold text-primary">
            Alex
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 ml-8">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                isActive(tab.href)
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground hover:text-primary'
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </div>

        {/* Theme Toggle */}
        <div className="flex-shrink-0">
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
