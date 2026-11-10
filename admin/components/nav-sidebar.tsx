"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ExternalLink,
  LogOut,
  X,
  ShieldCheck,
} from "lucide-react";
import { usePermission } from "@/lib/auth/use-permission";
import { useAuth } from "@/lib/auth/auth-context";
import { NAV_SECTIONS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
export function NavSidebar({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { hasAllPermissions } = usePermission();
  const { user, logout } = useAuth();
  return (
    <>
      {open && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside
        className={cn("admin-sidebar", open && "is-open")}
        aria-label="Main navigation"
      >
        <Link href="/" className="sidebar-brand" onClick={onClose}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/canvas-india-official-logo.webp"
            alt="Canvas India"
            width={144}
            height={62}
          />
          <span>STUDIO & OPERATIONS</span>
        </Link>
        <button
          className="sidebar-mobile-close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
        <nav className="sidebar-navigation">
          {NAV_SECTIONS.map((section) => {
            const links = section.links.filter((link) =>
              hasAllPermissions(link.permissions),
            );
            if (!links.length) return null;
            return (
              <details key={section.label} open className="nav-section">
                <summary>
                  {section.label}
                  <ChevronDown size={12} />
                </summary>
                <div>
                  {links.map((link) => {
                    const active =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname === link.href ||
                          pathname.startsWith(link.href + "/");
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn("sidebar-link", active && "active")}
                      >
                        <Icon size={17} strokeWidth={1.7} />
                        <span>{link.label}</span>
                        {link.href === "/shapes" && (
                          <span className="nav-ai">AUTO</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </nav>
        <div className="sidebar-store">
          <a href="https://canvassindia.com" target="_blank" rel="noreferrer">
            Visit your storefront <ExternalLink size={14} />
          </a>
        </div>
        <div className="sidebar-account">
          <span className="account-avatar">
            {(user?.email || "A").slice(0, 1).toUpperCase()}
          </span>
          <div>
            <strong>{user?.email?.split("@")[0]}</strong>
            <span>
              <ShieldCheck size={11} />
              {user?.roleName || "Team member"}
            </span>
          </div>
          <button
            title="Sign out"
            aria-label="Sign out"
            onClick={() => logout()}
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>
    </>
  );
}
