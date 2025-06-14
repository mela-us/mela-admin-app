"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/types/user"
import { Search, Filter, Plus, ListFilter, ArrowDownAZ, ArrowUpZA, Users } from "lucide-react"
import UserTable from "./user-table"

interface Props {
  initialUsers: User[]
  roles: { value: string; label: string }[]
  averageScores: { userId: string; averageScore: number }[]
}

export default function UserList({ initialUsers, roles, averageScores }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all")
  const [selectedScoreFilter, setSelectedScoreFilter] = useState<string>("all")
  const [selectedAgeFilter, setSelectedAgeFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const getPerformanceRating = (score: number): string => {
    if (score >= 90) return "Xuất sắc"
    if (score >= 80) return "Giỏi"
    if (score >= 65) return "Khá"
    if (score >= 50) return "Trung bình"
    return "Yếu"
  }

  const calculateAge = (birthday: string | null): number => {
    if (!birthday) return 0
    const birthDate = new Date(birthday)
    const currentDate = new Date()
    const age = currentDate.getFullYear() - birthDate.getFullYear()
    const monthDiff = currentDate.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

  const handleSort = (order: "asc" | "desc") => {
    setSortOrder(order)
    const sortedUsers = [...users].sort((a, b) => {
      const nameA = a.username
      const nameB = b.username
      return order === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
    })
    setUsers(sortedUsers)
  }

  const filteredUsers = users.filter((user) => {
    const roleMatch = selectedRoleFilter === "all" || user.userRole === selectedRoleFilter
    const score = averageScores.find((s) => s.userId === user.userId)?.averageScore || 0
    const rating = getPerformanceRating(score)
    const scoreMatch = selectedScoreFilter === "all" || rating === selectedScoreFilter
    const age = calculateAge(user.birthday)
    const ageMatch =
      selectedAgeFilter === "all" ||
      (selectedAgeFilter === "0-5" && age <= 5) ||
      (selectedAgeFilter === "6-10" && age >= 6 && age <= 10) ||
      (selectedAgeFilter === "11-14" && age >= 11 && age <= 14) ||
      (selectedAgeFilter === "15-17" && age >= 15 && age <= 17) ||
      (selectedAgeFilter === "18+" && age >= 18)
    const searchMatch =
      searchQuery === "" ||
      (user.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.username || "").toLowerCase().includes(searchQuery.toLowerCase())
    return roleMatch && scoreMatch && ageMatch && searchMatch
  })

  const handleDeleteUser = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Xóa người dùng thất bại")
      }
      setUsers(users.filter((user) => user.userId !== id))
      toast({
        title: "Thành công",
        description: "Đã xóa người dùng",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa người dùng",
        variant: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const activeFiltersCount =
    (selectedRoleFilter !== "all" ? 1 : 0) +
    (selectedScoreFilter !== "all" ? 1 : 0) +
    (selectedAgeFilter !== "all" ? 1 : 0) +
    (searchQuery !== "" ? 1 : 0)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-500" />
            Danh sách người dùng
          </h2>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-medium px-5 py-2 rounded-lg shadow transition-all duration-200"
        >
          <Link href="/users/add">
            <Plus className="mr-2 h-4 w-4" /> Thêm mới
          </Link>
        </Button>
      </div>

      {/* Search and filter toolbar */}
      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-start md-weight: 600;items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full text-sm"
            />
          </div>

          {/* Filter buttons group */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 px-4 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium">
                  <ListFilter className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>Sắp xếp</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleSort("asc")} className="cursor-pointer text-sm">
                    <ArrowDownAZ className="mr-2 h-4 w-4 text-indigo-500" />
                    <span>Tên A-Z</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("desc")} className="cursor-pointer text-sm">
                    <ArrowUpZA className="mr-2 h-4 w-4 text-indigo-500" />
                    <span>Tên Z-A</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant={isFilterOpen ? "secondary" : "outline"}
              className={`flex items-center gap-2 h-10 px-4 text-sm font-medium ${isFilterOpen ? 'bg-indigo-100 text-indigo-900 border-indigo-300 hover:bg-indigo-200' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className={`h-4 w-4 ${isFilterOpen ? 'text-indigo-900' : 'text-gray-500'}`} />
              Bộ lọc
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 bg-indigo-200 text-indigo-800 hover:bg-indigo-300 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Filter panel */}
        {isFilterOpen && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="role-filter" className="text-sm font-medium text-gray-700">Vai trò</Label>
                <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
                  <SelectTrigger id="role-filter" className="border-gray-200 bg-white text-sm">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-sm">Tất cả vai trò</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value} className="text-sm">
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="score-filter" className="text-sm font-medium text-gray-700">Xếp loại</Label>
                <Select value={selectedScoreFilter} onValueChange={setSelectedScoreFilter}>
                  <SelectTrigger id="score-filter" className="border-gray-200 bg-white text-sm">
                    <SelectValue placeholder="Chọn xếp loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-sm">Tất cả xếp loại</SelectItem>
                    <SelectItem value="Xuất sắc" className="text-sm">Xuất sắc (90-100)</SelectItem>
                    <SelectItem value="Giỏi" className="text-sm">Giỏi (80-90)</SelectItem>
                    <SelectItem value="Khá" className="text-sm">Khá (65-80)</SelectItem>
                    <SelectItem value="Trung bình" className="text-sm">Trung bình (50-65)</SelectItem>
                    <SelectItem value="Yếu" className="text-sm">Yếu (0-50)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age-filter" className="text-sm font-medium text-gray-700">Độ tuổi</Label>
                <Select value={selectedAgeFilter} onValueChange={setSelectedAgeFilter}>
                  <SelectTrigger id="age-filter" className="border-gray-200 bg-white text-sm">
                    <SelectValue placeholder="Chọn độ tuổi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-sm">Tất cả độ tuổi</SelectItem>
                    <SelectItem value="0-5" className="text-sm">0-5 tuổi</SelectItem>
                    <SelectItem value="6-9" className="text-sm">6-9 tuổi</SelectItem>
                    <SelectItem value="9-14" className="text-sm">9-14 tuổi</SelectItem>
                    <SelectItem value="15-17" className="text-sm">15-17 tuổi</SelectItem>
                    <SelectItem value="18+" className="text-sm">18+ tuổi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active filters summary */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {activeFiltersCount > 0 ? (
                  <span>
                    Đang lọc: {" "}
                    {selectedRoleFilter !== "all" && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 mr-2 text-xs">
                        {selectedRoleFilter}
                      </Badge>
                    )}
                    {selectedScoreFilter !== "all" && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 mr-2 text-xs">
                        {selectedScoreFilter}
                      </Badge>
                    )}
                    {selectedAgeFilter !== "all" && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 mr-2 text-xs">
                        {selectedAgeFilter}
                      </Badge>
                    )}
                    {searchQuery !== "" && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                        Tìm kiếm "{searchQuery}"
                      </Badge>
                    )}
                  </span>
                ) : (
                  <span>Không có bộ lọc nào được áp dụng</span>
                )}
              </div>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 text-sm"
                  onClick={() => {
                    setSelectedRoleFilter("all")
                    setSelectedScoreFilter("all")
                    setSelectedAgeFilter("all")
                    setSearchQuery("")
                  }}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-indigo-700/80 pl-2 mt-1">
          {filteredUsers.length > 0 ? (
            <span>Hiển thị <strong>{filteredUsers.length}</strong> người dùng</span>
          ) : (
            <span>Không tìm thấy người dùng nào phù hợp với điều kiện lọc</span>
          )}
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        <UserTable
          users={filteredUsers}
          roles={roles}
          averageScores={averageScores}
          onDelete={handleDeleteUser}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
