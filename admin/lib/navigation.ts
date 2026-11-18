import {
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
  Star,
  PackageSearch,
  History,
  Factory,
  Megaphone,
  BadgePercent,
  ShoppingCart,
  TriangleAlert,
  Truck,
  Palette,
  UsersRound,
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
        href: "/shipments",
        label: "Shipments",
        icon: Truck,
        permissions: ["shipping.view"],
      },
      {
        href: "/ndr",
        label: "Delivery exceptions (NDR)",
        icon: TriangleAlert,
        permissions: ["ndr.view"],
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
      {
        href: "/segments",
        label: "Customer segments",
        icon: UsersRound,
        permissions: ["segments.view"],
      },
      {
        href: "/reviews",
        label: "Reviews",
        icon: Star,
        permissions: ["reviews.view"],
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
      {
        href: "/inventory",
        label: "Inventory",
        icon: PackageSearch,
        permissions: ["inventory.view"],
      },
      {
        href: "/artwork",
        label: "Artwork approvals",
        icon: Palette,
        permissions: ["artwork.view"],
      },
      {
        href: "/production",
        label: "Production",
        icon: Factory,
        permissions: ["production.view"],
        alsoMatches: ["/production/batches", "/production/board", "/production/jobs", "/production/machines", "/production/materials"],
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
      {
        href: "/promotions",
        label: "Promotions",
        icon: BadgePercent,
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
        icon: ShoppingCart,
        permissions: ["abandoned_carts.view"],
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
        href: "/roles",
        label: "Roles & permissions",
        icon: ShieldCheck,
        permissions: ["roles.view"],
      },
      { href: "/settings", label: "Settings", icon: Settings, permissions: [] },
      {
        href: "/audit-log",
        label: "Audit log",
        icon: History,
        permissions: ["audit.view"],
      },
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
