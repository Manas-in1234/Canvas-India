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
  Users,
  UserCog,
  ShieldCheck,
  Palette,
  BarChart3,
  ScanLine,
  Settings,
  RotateCcw,
  SlidersHorizontal,
  Ruler,
  IndianRupee,
  ImageIcon,
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
        href: "/hero-images",
        label: "Hero Images",
        icon: ImageIcon,
        permissions: ["products.edit"],
      },
      {
        href: "/customers",
        label: "Customers",
        icon: Users,
        permissions: ["customers.view"],
      },
      {
        href: "/discounts",
        label: "Discount codes",
        icon: Tag,
        permissions: ["discounts.view"],
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
        href: "/option-categories",
        label: "Customize page options",
        icon: SlidersHorizontal,
        permissions: ["option_catalog.view"],
      },
      {
        href: "/sizes",
        label: "Size presets",
        icon: Ruler,
        permissions: ["size_presets.view"],
      },
      {
        href: "/pricing",
        label: "Pricing",
        icon: IndianRupee,
        permissions: ["pricing.view"],
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
