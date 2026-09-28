'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Boxes,
  Warehouse,
  Truck,
  AlertTriangle,
  Factory,
  LayoutGrid,
  Wrench,
  Layers,
  Boxes as BatchIcon,
  Tag,
  Megaphone,
  ShoppingBag,
  UserCog,
  ShieldCheck,
  Settings,
  LogOut,
} from 'lucide-react';
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

interface NavSection {
  label: string | null;
  links: NavLink[];
}

// Every entry names the exact permission the corresponding backend endpoint
// requires (per the API survey) — a link never appears for a role that
// couldn't actually use the page behind it.
const NAV_SECTIONS: NavSection[] = [
  {
    label: null,
    links: [{ href: '/', label: 'Dashboard', icon: LayoutDashboard, requiredPermissions: [] }],
  },
  {
    label: 'Commerce',
    links: [
      { href: '/orders', label: 'Orders', icon: ShoppingCart, requiredPermissions: ['orders.view'] },
      { href: '/products', label: 'Products', icon: Package, requiredPermissions: ['products.view'] },
      { href: '/customers', label: 'Customers', icon: Users, requiredPermissions: ['customers.view'] },
    ],
  },
  {
    label: 'Fulfillment',
    links: [
      { href: '/inventory', label: 'Inventory', icon: Boxes, requiredPermissions: ['inventory.view'] },
      { href: '/warehouses', label: 'Warehouses', icon: Warehouse, requiredPermissions: ['warehouses.view'] },
      { href: '/shipments', label: 'Shipments', icon: Truck, requiredPermissions: ['shipping.view'] },
      { href: '/ndr', label: 'NDR Cases', icon: AlertTriangle, requiredPermissions: ['ndr.view'] },
    ],
  },
  {
    label: 'Production',
    links: [
      { href: '/production/board', label: 'Board', icon: LayoutGrid, requiredPermissions: ['production.view'] },
      { href: '/production/jobs', label: 'Jobs', icon: Factory, requiredPermissions: ['production.view'] },
      { href: '/production/machines', label: 'Machines', icon: Wrench, requiredPermissions: ['machines.view'] },
      { href: '/production/materials', label: 'Materials', icon: Layers, requiredPermissions: ['materials.view'] },
      { href: '/production/batches', label: 'Batches', icon: BatchIcon, requiredPermissions: ['production.view'] },
    ],
  },
  {
    label: 'Growth',
    links: [
      { href: '/discounts', label: 'Discounts', icon: Tag, requiredPermissions: ['discounts.view'] },
      { href: '/campaigns', label: 'Campaigns', icon: Megaphone, requiredPermissions: ['campaigns.view'] },
      {
        href: '/abandoned-carts',
        label: 'Abandoned Carts',
        icon: ShoppingBag,
        requiredPermissions: ['abandoned_carts.view'],
      },
    ],
  },
  {
    label: 'Administration',
    links: [
      { href: '/users', label: 'Admin Users', icon: UserCog, requiredPermissions: ['users.view'] },
      { href: '/roles', label: 'Roles', icon: ShieldCheck, requiredPermissions: ['roles.view'] },
    ],
  },
  {
    label: null,
    links: [{ href: '/settings', label: 'Settings', icon: Settings, requiredPermissions: [] }],
  },
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

      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        {NAV_SECTIONS.map((section, idx) => {
          const visibleLinks = section.links.filter((link) => hasAllPermissions(link.requiredPermissions));
          if (visibleLinks.length === 0) return null;

          return (
            <div key={section.label ?? `section-${idx}`} className="space-y-1">
              {section.label && (
                <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {section.label}
                </div>
              )}
              {visibleLinks.map((link) => {
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
            </div>
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
