"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Building2,
  Star,
  Settings,
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

export function DashboardMobileBar() {
  const pathname = usePathname();
  return (
    <div className="lg:hidden sticky top-0 z-30 glass border-b border-border/60">
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gold text-gold-foreground font-display text-sm font-bold">
            B
          </span>
          <span className="text-sm font-semibold">BCL Admin</span>
        </Link>
        <SignOutForm variant="icon" />
      </div>
      <nav className="flex items-center gap-1.5 px-3 pb-2 overflow-x-auto scrollbar-none">
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
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-gold/40 bg-gold/10 text-gold"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
