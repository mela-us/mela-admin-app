import UserList from "@/components/users/user-list"
import type { User } from "@/types/user"
import { Users } from "lucide-react"

const mockRoles: string[] = ["USER", "ADMIN"]
const mockAverageScores: { userId: string; averageScore: number }[] = [
  { userId: "0083eff5-53f6-44dd-b43e-5c1ad11519d6", averageScore: 85 },
  { userId: "1234eff5-53f6-44dd-b43e-5c1ad11519d7", averageScore: 92 },
  { userId: "5678eff5-53f6-44dd-b43e-5c1ad11519d8", averageScore: 60 },
]

const mockUsers: User[] = [
  {
    userId: "0083eff5-53f6-44dd-b43e-5c1ad11519d6",
    username: "nths4@gmail.com",
    imageUrl: null,
    fullName: "Nguyen Thi Hoa Sen",
    createdAt: "2024-12-16T17:59:43.670+00:00",
    updatedAt: "2024-12-16T17:59:43.670+00:00",
    birthday: null,
    userRole: "USER",
  },
  {
    userId: "1234eff5-53f6-44dd-b43e-5c1ad11519d7",
    username: "admin@mela.com",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1200px-User_icon_2.svg.png",
    fullName: "Admin User",
    createdAt: "2024-12-15T10:00:00.000+00:00",
    updatedAt: "2024-12-15T10:00:00.000+00:00",
    birthday: "1980-01-01",
    userRole: "ADMIN",
  },
  {
    userId: "5678eff5-53f6-44dd-b43e-5c1ad11519d8",
    username: "student2@mela.com",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1200px-User_icon_2.svg.png",
    fullName: "Tran Van B",
    createdAt: "2024-12-17T08:30:00.000+00:00",
    updatedAt: "2024-12-17T08:30:00.000+00:00",
    birthday: "2005-05-20",
    userRole: "USER",
  },
]

async function getUsers(): Promise<User[]> {
  return Promise.resolve(mockUsers)
}

export default async function UsersPage() {
  const users = await getUsers()
  const roles = mockRoles.map((role) => ({ value: role, label: role }))
  const averageScores = mockAverageScores

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-500 relative rounded-xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Quản lý người dùng</h1>
          <p className="text-blue-100 max-w-2xl">
            Quản lý thông tin người dùng trong hệ thống MELA.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20">
          <Users size={180} />
        </div>
      </div>
      <UserList initialUsers={users} roles={roles} averageScores={averageScores} />
    </div>
  )
}
