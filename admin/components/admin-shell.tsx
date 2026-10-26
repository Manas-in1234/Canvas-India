"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Menu,
  Search,
  ExternalLink,
  RefreshCw,
  ChevronRight,
  X,
} from "lucide-react";
import { NavSidebar } from "./nav-sidebar";
import { currentNavigation, NAV_SECTIONS } from "@/lib/navigation";
import { usePermission } from "@/lib/auth/use-permission";
export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const current = currentNavigation(pathname);
  const client = useQueryClient();
  const { hasAllPermissions } = usePermission();
  useEffect(() => {
    if (!mobileOpen) return;
    document.querySelector<HTMLButtonElement>(".sidebar-mobile-close")?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      menuRef.current?.focus();
    };
  }, [mobileOpen]);
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setSearch("");
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);
  const matches = NAV_SECTIONS.flatMap((section) =>
    section.links.map((link) => ({ ...link, section: section.label })),
  )
    .filter(
      (link) =>
        hasAllPermissions(link.permissions) &&
        `${link.label} ${link.section}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .slice(0, 7);
  async function refresh() {
    setRefreshing(true);
    try {
      await client.invalidateQueries();
    } finally {
      setRefreshing(false);
    }
  }
  return (
    <div className="admin-shell">
      <a href="#workspace-content" className="skip-link">
        Skip to content
      </a>
      <NavSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="admin-workspace" inert={mobileOpen}>
        <header className="workspace-header">
          <button
            ref={menuRef}
            className="mobile-menu icon-button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
          >
            <Menu size={21} />
          </button>
          <div className="workspace-breadcrumb">
            <span>{current.section}</span>
            <ChevronRight size={13} />
            <strong>{current.label}</strong>
          </div>
          <div className="workspace-search">
            <Search size={16} />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a page…"
              aria-label="Search admin pages"
            />
            <kbd>⌘ K</kbd>
            {search && (
              <div className="page-search-results">
                <div className="search-caption">
                  GO TO A PAGE
                  <button
                    aria-label="Clear page search"
                    onClick={() => setSearch("")}
                  >
                    <X size={14} />
                  </button>
                </div>
                {matches.length ? (
                  matches.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSearch("")}
                    >
                      <link.icon size={16} />
                      <span>
                        {link.label}
                        <small>{link.section}</small>
                      </span>
                      <ChevronRight size={14} />
                    </Link>
                  ))
                ) : (
                  <p>No matching pages.</p>
                )}
              </div>
            )}
          </div>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="Refresh workspace data"
              title="Refresh data"
              disabled={refreshing}
              onClick={refresh}
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
            <span className="header-divider" />
            <a
              href="https://canvassindia.com"
              target="_blank"
              rel="noreferrer"
              className="storefront-link"
            >
              View store <ExternalLink size={14} />
            </a>
            <span className="header-avatar" aria-label="Canvas India workspace">
              CI
            </span>
          </div>
        </header>
        <main id="workspace-content" className="workspace-content">
          {children}
        </main>
        <footer className="workspace-footer">
          <span>Canvas India · Made for your creative business</span>
          <span>Canvas · Acrylic · Cork</span>
        </footer>
      </div>
    </div>
  );
}
