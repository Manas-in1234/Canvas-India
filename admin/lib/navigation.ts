import {
  History,
  LayoutTemplate,
  Truck,
  PackageX,
  Settings2,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  Tag,
  Gift,
  Users,
  UserCog,
  ShieldCheck,
  BarChart3,
  Settings,
  RotateCcw,
  SlidersHorizontal,
  IndianRupee,
  ImageIcon,
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
    label: "Sales & customers",
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
        href: "/customers",
        label: "Customers",
        icon: Users,
        permissions: ["customers.view"],
      },
    ],
  },
  {
    label: "Delivery",
    links: [
      {
        href: "/shipments",
        label: "Shipments",
        icon: Truck,
        permissions: ["shipping.view"],
        alsoMatches: ["/shipments"],
      },
      {
        href: "/ndr",
        label: "Delivery problems",
        icon: PackageX,
        permissions: ["ndr.view"],
      },
      {
        href: "/delivery-settings",
        label: "Delivery settings",
        icon: Settings2,
        permissions: ["shipping.view"],
      },
    ],
  },
  {
    label: "Catalog",
    links: [
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
    ],
  },
  {
    label: "Storefront & promotions",
    links: [
      {
        href: "/homepage-promotions",
        label: "Homepage Promotions",
        icon: ImageIcon,
        permissions: ["discounts.manage"],
      },
      {
        href: "/homepage-layout",
        label: "Homepage layout",
        icon: LayoutTemplate,
        permissions: ["products.edit"],
      },
      {
        href: "/hero-images",
        label: "Hero Images",
        icon: ImageIcon,
        permissions: ["products.edit"],
      },
      {
        href: "/occasions",
        label: "Gifts & Occasions",
        icon: Gift,
        permissions: ["products.edit"],
      },
      {
        href: "/discounts",
        label: "Discount codes",
        icon: Tag,
        permissions: ["discounts.view"],
      },
    ],
  },
  {
    label: "Customization studio",
    links: [
      {
        href: "/customization",
        label: "Customization",
        icon: SlidersHorizontal,
        permissions: ["option_catalog.view"],
      },
      {
        href: "/pricing",
        label: "Customizer pricing",
        icon: IndianRupee,
        permissions: ["pricing.view"],
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
        href: "/activity-log",
        label: "Activity log",
        icon: History,
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
