"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Building2,
  Star,
  Settings,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutForm } from "./sign-out-form";

const items: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads", icon: Inbox },
  { href: "/dashboard/projects", label: "Projects", icon: Building2 },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface DashboardSidebarProps {
  userEmail?: string | null;
}

export function DashboardSidebar({ userEmail }: DashboardSidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-surface/40 px-4 py-6">
      <Link href="/" className="flex items-center gap-2.5 px-2">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-gold text-gold-foreground font-display text-base font-bold">
          B
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">BCL Admin</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            CRM
          </span>
        </div>
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-surface-2 text-foreground"
                  : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Live site
          </div>
          <Link
            href="/"
            className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-gold"
          >
            bclplastering.com
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {userEmail ? (
          <div className="rounded-lg border border-border bg-surface px-4 py-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Signed in
            </div>
            <div className="mt-1 truncate text-sm font-medium text-foreground">
              {userEmail}
            </div>
            <div className="mt-3">
              <SignOutForm />
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
