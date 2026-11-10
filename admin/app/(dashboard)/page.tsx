"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  ArrowRight,
  ShoppingBag,
  IndianRupee,
  ScanLine,
  Clock3,
  CalendarDays,
  Activity,
  PackageCheck,
  Palette,
  Package,
  Factory,
  Sparkles,
  TriangleAlert,
  BarChart3,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { OrderListItem } from "@/lib/types/order";
import type { CustomShapeListItem } from "@/lib/types/shape";
import type { ProductionAnalytics } from "@/lib/types/analytics-full";
import { formatCurrency, formatCurrencyNumber, formatDate } from "@/lib/format";
import { orderOverview } from "@/lib/dashboard";
import { usePermission } from "@/lib/auth/use-permission";
import { useAuth } from "@/lib/auth/auth-context";
import { StatusBadge } from "@/components/status-badge";

export default function DashboardHomePage() {
  const [days, setDays] = useState(30);
  const { hasPermission } = usePermission();
  const { user } = useAuth();
  const canOrders = hasPermission("orders.view"),
    canShapes = hasPermission("shapes.view"),
    canAnalytics = hasPermission("analytics.view");
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.get<OrderListItem[]>("/orders"),
    enabled: canOrders,
  });
  const shapesQuery = useQuery({
    queryKey: ["shapes"],
    queryFn: () => apiClient.get<CustomShapeListItem[]>("/admin/shapes"),
    enabled: canShapes,
  });
  const productionQuery = useQuery({
    queryKey: ["dashboard", "production"],
    queryFn: () => apiClient.get<ProductionAnalytics>("/analytics/production"),
    enabled: canAnalytics,
  });
  const overview = orderOverview(ordersQuery.data || [], days);
  const shapes = shapesQuery.data || [],
    pending = shapes.filter((s) => s.status === "PENDING").length;
  const recent = [...(ordersQuery.data || [])]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 5);
  const ordersReady = canOrders && !!ordersQuery.data;
  const shapesReady = canShapes && !!shapesQuery.data;
  const errors =
    ordersQuery.isError || shapesQuery.isError || productionQuery.isError;
  const tiles = [
    {
      label: "Paid order value",
      value: ordersReady ? formatCurrencyNumber(overview.paidAmount) : "—",
      detail: ordersReady
        ? `${overview.paidOrders} paid order${overview.paidOrders === 1 ? "" : "s"} · includes tax & shipping`
        : "Waiting for order data",
      icon: IndianRupee,
      tone: "",
    },
    {
      label: "Orders received",
      value: ordersReady ? String(overview.selected.length) : "—",
      detail: `Across all payment statuses`,
      icon: ShoppingBag,
      tone: "orange",
    },
    {
      label: "Awaiting payment",
      value: ordersReady ? String(overview.awaitingPayment) : "—",
      detail: "Pending or authorized payments",
      icon: Clock3,
      tone: "purple",
    },
    {
      label: "Shapes to review",
      value: shapesReady ? String(pending) : "—",
      detail: "All pending outlines · ready for review",
      icon: ScanLine,
      tone: "green",
    },
  ];
  const workflows = [
    {
      href: "/products",
      title: "Manage your catalogue",
      text: "Canvas, acrylic, cork & more",
      icon: Package,
      permission: "products.view",
    },
    {
      href: "/artwork",
      title: "Review artwork",
      text: "Check designs before printing",
      icon: Palette,
      permission: "artwork.view",
    },
    {
      href: "/production/board",
      title: "Keep production moving",
      text: "Follow every job through the studio",
      icon: Factory,
      permission: "production.view",
    },
  ].filter((item) => hasPermission(item.permission));
  return (
    <div>
      <div className="page-heading">
        <div>
          <div className="page-eyebrow">YOUR BUSINESS, AT A GLANCE</div>
          <h1>
            Good to see you, {user?.email?.split("@")[0] || "team"}{" "}
            <span className="text-[#e8924e]">.</span>
          </h1>
          <p>Here’s what’s happening at Canvas India.</p>
        </div>
        <div className="page-heading-actions">
          <span className="welcome-note">
            <CalendarDays size={12} />
            {new Intl.DateTimeFormat("en-IN", {
              timeZone: "Asia/Kolkata",
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(new Date())}{" "}
            · IST
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] text-[#8a98aa]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#36ac8b]" />
          Live store overview <span className="text-[#c8d1dc]">/</span>
          <span>India Standard Time</span>
        </div>
        <div className="date-options" aria-label="Dashboard date range">
          {[
            { days: 1, label: "Today" },
            { days: 7, label: "Last 7 days" },
            { days: 30, label: "Last 30 days" },
          ].map((option) => (
            <button
              key={option.days}
              className={days === option.days ? "active" : ""}
              aria-pressed={days === option.days}
              onClick={() => setDays(option.days)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {errors && (
        <div className="workspace-alert" role="alert">
          <TriangleAlert size={16} />
          Some store data could not be loaded. Figures shown as — are
          unavailable.
          <button
            onClick={() => {
              if (canOrders) ordersQuery.refetch();
              if (canShapes) shapesQuery.refetch();
              if (canAnalytics) productionQuery.refetch();
            }}
          >
            Retry
          </button>
        </div>
      )}
      <div className="dashboard-stats">
        {tiles.map((tile) => (
          <div key={tile.label} className="stat-card">
            <div className="stat-card-top">
              <span>{tile.label}</span>
              <span className={`stat-icon ${tile.tone}`}>
                <tile.icon size={17} />
              </span>
            </div>
            <strong className="stat-value">{tile.value}</strong>
            <span className="stat-foot">{tile.detail}</span>
          </div>
        ))}
      </div>
      <div className="dashboard-columns">
        <section className="dashboard-panel">
          <div className="panel-head">
            <div>
              <h2 className="section-label">
                <BarChart3 size={16} />
                Sales performance
              </h2>
              <p className="section-subtitle">
                Paid order value over your selected period
              </p>
            </div>
            {canAnalytics && (
              <Link href="/analytics">
                Full report <ArrowUpRight size={13} />
              </Link>
            )}
          </div>
          <div className="panel-body">
            <div className="chart-topline">
              <div>
                <strong>
                  {ordersReady
                    ? formatCurrencyNumber(overview.paidAmount)
                    : "—"}
                </strong>
                <span>
                  {ordersReady
                    ? `${overview.paidOrders} paid order${overview.paidOrders === 1 ? "" : "s"} in this period`
                    : "Order access or data is unavailable"}
                </span>
              </div>
              <div className="chart-legend">Paid orders</div>
            </div>
            {overview.buckets.some((b) => b.amount > 0) ? (
              <svg
                className="revenue-chart"
                viewBox="0 0 600 160"
                preserveAspectRatio="none"
                role="img"
                aria-label="Daily paid order value"
              >
                <defs>
                  <linearGradient id="sales-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#397cc4" stopOpacity=".2" />
                    <stop offset="100%" stopColor="#397cc4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 40, 80, 120, 159].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    x2="600"
                    y1={y}
                    y2={y}
                    stroke="#edf1f6"
                    strokeDasharray="4 5"
                  />
                ))}
                {(() => {
                  const max = Math.max(
                    ...overview.buckets.map((b) => b.amount),
                    1,
                  );
                  const points = overview.buckets.map(
                    (b, i) =>
                      `${i * (600 / Math.max(overview.buckets.length - 1, 1))},${145 - (b.amount / max) * 125}`,
                  );
                  const path = "M" + points.join(" L");
                  return (
                    <>
                      <path
                        d={`${path} L600,160 L0,160 Z`}
                        fill="url(#sales-fill)"
                      />
                      <path
                        d={path}
                        fill="none"
                        stroke="#2d6db5"
                        strokeWidth="2.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    </>
                  );
                })()}
              </svg>
            ) : (
              <div className="chart-empty">
                <Activity size={23} />
                <span>
                  {ordersQuery.isLoading
                    ? "Loading sales…"
                    : ordersReady
                      ? "No paid orders in this period"
                      : "Sales data is unavailable"}
                </span>
              </div>
            )}
            <div className="chart-dates">
              <span>{overview.buckets[0].date}</span>
              <span>{overview.buckets[overview.buckets.length - 1].date}</span>
            </div>
          </div>
        </section>
        <section className="dashboard-panel">
          <div className="panel-head">
            <div>
              <h2 className="section-label">
                <Activity size={16} />
                Needs your attention
              </h2>
              <p className="section-subtitle">A little focus goes a long way</p>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-[#ec9c58]" />
          </div>
          <div
            className="panel-body"
            style={{ paddingTop: 4, paddingBottom: 8 }}
          >
            {canShapes && (
              <Link href="/shapes" className="attention-row">
                <span className="stat-icon orange">
                  <ScanLine size={17} />
                </span>
                <div>
                  <strong>Shape approvals</strong>
                  <small>Review auto-detected outlines</small>
                </div>
                <span className="attention-count">
                  {shapesReady ? pending : "—"}
                </span>
                <ArrowRight size={13} className="text-[#aab6c4]" />
              </Link>
            )}
            {canOrders && (
              <Link href="/orders" className="attention-row">
                <span className="stat-icon">
                  <PackageCheck size={17} />
                </span>
                <div>
                  <strong>Ready for fulfilment</strong>
                  <small>Paid orders not yet dispatched</small>
                </div>
                <span className="attention-count">
                  {ordersReady ? overview.toFulfil : "—"}
                </span>
                <ArrowRight size={13} className="text-[#aab6c4]" />
              </Link>
            )}
            {hasPermission("production.view") && (
              <Link href="/production/board" className="attention-row">
                <span className="stat-icon purple">
                  <Factory size={17} />
                </span>
                <div>
                  <strong>Production queue</strong>
                  <small>Jobs waiting to be started</small>
                </div>
                <span className="attention-count">
                  {productionQuery.data?.summary.queuedJobs ?? "—"}
                </span>
                <ArrowRight size={13} className="text-[#aab6c4]" />
              </Link>
            )}
            {!canOrders && !canShapes && !hasPermission("production.view") && (
              <p className="py-8 text-xs text-muted-foreground">
                Your assigned tools are available in the navigation.
              </p>
            )}
          </div>
        </section>
      </div>
      {canOrders && (
        <section className="dashboard-panel">
          <div className="panel-head">
            <div>
              <h2 className="section-label">
                <ShoppingBag size={16} />
                Recent orders
              </h2>
              <p className="section-subtitle">
                Your latest creations, on their way to someone’s home
              </p>
            </div>
            <Link href="/orders">
              View all orders <ArrowRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#fafbfd] text-[9px] uppercase tracking-wider text-[#8a99ac]">
                <tr>
                  {[
                    "Order",
                    "Customer",
                    "Placed",
                    "Payment",
                    "Order status",
                    "Amount",
                  ].map((title) => (
                    <th key={title} className="px-5 py-3 font-medium">
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-[#edf1f6] text-[11px]"
                  >
                    <td className="px-5 py-4 font-medium text-[#2f639d]">
                      <Link
                        href={`/orders/placeholder?id=${encodeURIComponent(order.id)}`}
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      {order.customer?.name || "Guest"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[#8c99a9]">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-5 py-4 font-medium">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!recent.length && (
              <div className="flex flex-col items-center gap-2 px-5 py-11 text-xs text-[#94a4b6]">
                <ShoppingBag size={24} />
                {ordersQuery.isLoading
                  ? "Loading your orders…"
                  : ordersQuery.isError
                    ? "Orders could not be loaded."
                    : "Your next creative order starts here."}
              </div>
            )}
          </div>
        </section>
      )}
      {canShapes && (
        <section className="studio-banner">
          <div className="studio-mark">
            <ScanLine size={30} />
          </div>
          <div>
            <div
              className="page-eyebrow"
              style={{ marginBottom: 5, color: "#8da7c8" }}
            >
              YOUR CUSTOMIZATION STUDIO
            </div>
            <h2>A new shape. A whole new possibility.</h2>
            <p>
              Upload a silhouette, let shape detection trace the outline, then
              review and approve it for your canvas & acrylic customizers.
            </p>
          </div>
          <Link href="/shapes">
            Open shape studio <ArrowUpRight size={14} />
          </Link>
        </section>
      )}
      {!!workflows.length && (
        <section className="mt-7">
          <h2 className="section-label mb-4">
            <Sparkles size={15} />
            Make your next move
          </h2>
          <div className="workflow-grid">
            {workflows.map((item) => (
              <Link href={item.href} key={item.href} className="workflow-link">
                <item.icon size={19} />
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </div>
                <ArrowUpRight size={13} className="ml-auto" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
