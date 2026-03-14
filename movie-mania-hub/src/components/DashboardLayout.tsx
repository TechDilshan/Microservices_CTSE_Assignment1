import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  navItems: NavItem[];
}

const DashboardLayout = ({ children, title, navItems }: DashboardLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border p-4 fixed top-16 bottom-0">
        <h2 className="font-display text-xl text-primary mb-6 tracking-wider">{title}</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors',
                location.pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-card border-b border-border overflow-x-auto">
        <div className="flex px-4 py-2 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors',
                location.pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 lg:ml-64 p-6 lg:pt-6 pt-20">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
