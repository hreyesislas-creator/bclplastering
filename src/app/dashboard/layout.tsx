import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardMobileBar } from "@/components/dashboard/dashboard-mobile-bar";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense-in-depth — middleware also blocks unauthenticated access.
  const user = await requireUser("/dashboard");

  return (
    <div className="flex flex-1 min-h-screen">
      <DashboardSidebar userEmail={user.email ?? null} />
      <div className="flex-1 flex flex-col">
        <DashboardMobileBar />
        <div className="flex-1 px-4 py-6 sm:px-8 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
