"use client"

import styles from "@/styles/dashboard.module.css"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Home, BookOpen, FileText, Layers, Grid, BarChart, ChevronDown, Users } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { NavLink, NavSubLink } from "./nav-link"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [contentOpen, setContentOpen] = useState(true)

  const isActive = (path: string) => pathname.startsWith(path)

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      const data = await res.json()
      if (!res.ok) {
        console.error("Logout failed:", data.error)
        alert("Lỗi khi đăng xuất: " + data.error)
        return
      }
      router.push("/login")
    } catch (err) {
      console.error("Client logout error:", err)
      alert("Có lỗi xảy ra khi đăng xuất!")
    }
  }

  return (
    <div className={`${styles.background} w-64 bg-gray-900/80 backdrop-blur-sm shadow-md relative`}>
      {/* Header */}
      <div className="p-4 border-b transparent border-white-200/10">
        <h1 className="text-2xl font-bold text-white drop-shadow-xl">MELA ADMIN</h1>
        <p className="text-sm font-semibold text-white">Quản lý nội dung toán học</p>
      </div>

      {/* Navigation */}
      <nav className="py-5 pl-2 pr-3 space-y-2">
        {/* Trang chủ */}
        <NavLink href="/" active={pathname === "/"}>
          <Home className="mr-2 h-4 w-4" />
          Trang chủ
        </NavLink>

        {/* Người dùng */}
        <NavLink href="/users" active={pathname.includes("/users")}>
          <Users className="mr-2 h-4 w-4" />
          Người dùng
        </NavLink>

        {/* Nội dung học tập (Collapsible) */}
        <Collapsible
          open={contentOpen}
          onOpenChange={setContentOpen}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`
                w-full justify-between shadow-sm transition-all duration-200 text-sm font-medium text-white text-left bg-purple-900 hover:text-white hover:bg-purple-700
                ${contentOpen ? "rounded-t-lg rounded-b-none bg-purple-700" : "rounded-lg"}`}>
              <span className="flex items-center">
                <BarChart className="mr-4 h-4 w-4" />
                Nội dung
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${contentOpen ? "rotate-0" : "rotate-180"}`} />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent
            className={`flex flex-col px-4 py-2 space-y-1 rounded-b-lg border-purple-400/20
              ${contentOpen ? "border-b-2 border-x-2" : "border-none"}`}>
            <NavSubLink href="/levels" active={isActive("/levels")}>
              <Layers className="mr-2 h-4 w-4" />
              Cấp độ
            </NavSubLink>
            <NavSubLink href="/topics" active={isActive("/topics")}>
              <Grid className="mr-2 h-4 w-4" />
              Chủ đề
            </NavSubLink>
            <NavSubLink href="/lectures" active={isActive("/lectures")}>
              <BookOpen className="mr-2 h-4 w-4" />
              Bài học
            </NavSubLink>
            <NavSubLink href="/exercises" active={isActive("/exercises")}>
              <FileText className="mr-2 h-4 w-4" />
              Luyện tập
            </NavSubLink>
          </CollapsibleContent>
        </Collapsible>

      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 w-full px-4">
        <Button
          variant="ghost"
          className="pl-2 pr-3 w-full justify-start bg-red-500 text-white hover:bg-red-600 rounded-lg"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
