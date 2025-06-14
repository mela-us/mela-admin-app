import type React from "react"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6 min-h-screen bg-slate-100">{children}</div>
      </div>
    </div>
  )
}
