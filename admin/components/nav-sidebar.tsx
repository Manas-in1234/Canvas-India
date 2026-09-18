'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { usePermission } from '@/lib/auth/use-permission';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPermissions: string[];
}

// Every entry names the exact permission the corresponding backend endpoint
// requires (per the API survey) — a link never appears for a role that
// couldn't actually use the page behind it.
const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, requiredPermissions: [] },
  { href: '/orders', label: 'Orders', icon: ShoppingCart, requiredPermissions: ['orders.view'] },
  { href: '/settings', label: 'Settings', icon: Settings, requiredPermissions: [] },
];

export function NavSidebar() {
  const pathname = usePathname();
  const { hasAllPermissions } = usePermission();
  const { user, logout } = useAuth();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <span className="font-semibold">CanvasChamp Admin</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_LINKS.filter((link) => hasAllPermissions(link.requiredPermissions)).map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <div className="mb-2 px-1 text-sm">
          <div className="font-medium">{user?.email}</div>
          <div className="text-xs text-muted-foreground">{user?.roleName}</div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={() => logout()}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
