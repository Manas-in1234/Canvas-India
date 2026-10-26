import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  Warehouse,
  Truck,
  AlertTriangle,
  Factory,
  LayoutGrid,
  Wrench,
  Layers,
  Tag,
  Megaphone,
  Users,
  UserCog,
  ShieldCheck,
  Palette,
  BarChart3,
  ScanLine,
  Sparkles,
  UsersRound,
  Settings,
  RotateCcw,
} from "lucide-react";
export const NAV_SECTIONS = [
  {
    label: "Workspace",
    links: [
      { href: "/", label: "Overview", icon: LayoutDashboard, permissions: [] },
      {
        href: "/analytics",
        label: "Analytics & reports",
        icon: BarChart3,
        permissions: ["analytics.view"],
      },
    ],
  },
  {
    label: "Store management",
    links: [
      {
        href: "/orders",
        label: "Orders",
        icon: ShoppingBag,
        permissions: ["orders.view"],
      },
      {
        href: "/returns",
        label: "Returns & replacements",
        icon: RotateCcw,
        permissions: ["returns.view"],
      },
      {
        href: "/products",
        label: "Products",
        icon: Package,
        permissions: ["products.view"],
      },
      {
        href: "/customers",
        label: "Customers",
        icon: Users,
        permissions: ["customers.view"],
      },
      {
        href: "/inventory",
        label: "Inventory",
        icon: Boxes,
        permissions: ["inventory.view"],
      },
      {
        href: "/warehouses",
        label: "Warehouses",
        icon: Warehouse,
        permissions: ["warehouses.view"],
      },
    ],
  },
  {
    label: "Customization studio",
    links: [
      {
        href: "/shapes",
        label: "Shape detection",
        icon: ScanLine,
        permissions: ["shapes.view"],
      },
      {
        href: "/artwork",
        label: "Artwork review",
        icon: Palette,
        permissions: ["artwork.view"],
      },
    ],
  },
  {
    label: "Production & delivery",
    links: [
      {
        href: "/production/board",
        label: "Production board",
        icon: LayoutGrid,
        permissions: ["production.view"],
      },
      {
        href: "/production/jobs",
        label: "Print jobs",
        icon: Factory,
        permissions: ["production.view"],
      },
      {
        href: "/production/machines",
        label: "Machines",
        icon: Wrench,
        permissions: ["machines.view"],
      },
      {
        href: "/production/materials",
        label: "Materials",
        icon: Layers,
        permissions: ["materials.view"],
      },
      {
        href: "/production/batches",
        label: "Batches",
        icon: Boxes,
        permissions: ["production.view"],
      },
      {
        href: "/shipments",
        label: "Shipments",
        icon: Truck,
        permissions: ["shipping.view"],
      },
      {
        href: "/ndr",
        label: "Delivery exceptions",
        icon: AlertTriangle,
        permissions: ["ndr.view"],
      },
    ],
  },
  {
    label: "Marketing & growth",
    links: [
      {
        href: "/discounts",
        label: "Discount codes",
        icon: Tag,
        permissions: ["discounts.view"],
      },
      {
        href: "/promotions",
        label: "Promotions",
        icon: Sparkles,
        permissions: ["promotions.view"],
      },
      {
        href: "/campaigns",
        label: "Campaigns",
        icon: Megaphone,
        permissions: ["campaigns.view"],
      },
      {
        href: "/abandoned-carts",
        label: "Abandoned carts",
        icon: ShoppingBag,
        permissions: ["abandoned_carts.view"],
      },
      {
        href: "/segments",
        label: "Customer segments",
        icon: UsersRound,
        permissions: ["segments.view"],
      },
    ],
  },
  {
    label: "Administration",
    links: [
      {
        href: "/users",
        label: "Team members",
        icon: UserCog,
        permissions: ["users.view"],
      },
      {
        href: "/roles",
        label: "Roles & permissions",
        icon: ShieldCheck,
        permissions: ["roles.view"],
      },
      { href: "/settings", label: "Settings", icon: Settings, permissions: [] },
    ],
  },
];
export function currentNavigation(pathname: string) {
  for (const section of NAV_SECTIONS) {
    const entry = section.links.find((link) =>
      link.href === "/"
        ? pathname === "/"
        : pathname === link.href || pathname.startsWith(link.href + "/"),
    );
    if (entry) return { ...entry, section: section.label };
  }
  return { label: "Workspace", section: "Canvas India", href: "/" };
}
