import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  Warehouse,
  Truck,
  AlertTriangle,
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
  PackageSearch,
  type LucideIcon,
} from "lucide-react";
export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  permissions: string[];
  /** Other path prefixes that should highlight this entry, e.g. detail pages
   * that live outside its own folder. */
  alsoMatches?: string[];
}
export interface NavSection {
  label: string;
  links: NavLink[];
}
export const NAV_SECTIONS: NavSection[] = [
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
        href: "/categories",
        label: "Categories",
        icon: Boxes,
        permissions: ["products.view"],
      },
      {
        href: "/homepage-promotions",
        label: "Homepage Promotions",
        icon: ImageIcon,
        permissions: ["discounts.manage"],
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
        href: "/customizer-products",
        label: "Customizer products",
        icon: Layers,
        permissions: ["option_catalog.view"],
      },
      {
        href: "/sizes",
        label: "Select size",
        icon: Ruler,
        permissions: ["size_presets.view"],
      },
      {
        href: "/option-categories",
        label: "Customize page options",
        icon: SlidersHorizontal,
        permissions: ["option_catalog.view"],
      },
      {
        href: "/product-customization",
        label: "Product customization",
        icon: PackageSearch,
        permissions: ["products.edit"],
      },
      {
        href: "/shapes",
        label: "Shape detection",
        icon: ScanLine,
        permissions: ["shapes.view"],
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
        alsoMatches: ["/production/jobs"],
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
export function isNavLinkActive(link: NavLink, pathname: string) {
  if (link.href === "/") return pathname === "/";
  return [link.href, ...(link.alsoMatches ?? [])].some(
    (base) => pathname === base || pathname.startsWith(base + "/"),
  );
}
export function currentNavigation(pathname: string) {
  for (const section of NAV_SECTIONS) {
    const entry = section.links.find((link) => isNavLinkActive(link, pathname));
    if (entry) return { ...entry, section: section.label };
  }
  return { label: "Workspace", section: "Canvas India", href: "/" };
}
