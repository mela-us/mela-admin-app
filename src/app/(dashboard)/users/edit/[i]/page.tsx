import UserForm from "@/components/users/user-form"
import type { User } from "@/types/user"

// Mock user data (simulating database fetch)
const mockUser: User = {
  userId: "0083eff5-53f6-44dd-b43e-5c1ad11519d6",
  username: "nths4@gmail.com",
  imageUrl: null,
  fullName: "Nguyen Thi Hoa Sen",
  createdAt: "2024-12-16T17:59:43.670+00:00",
  updatedAt: "2024-12-16T17:59:43.670+00:00",
  birthday: null,
  userRole: "USER",
}

async function getUser(userId: string): Promise<User> {
  // Simulate API call to fetch user
  const user = mockUser
  return user
}

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const { id } = await params

  let user: User

  try {
    user = await getUser(id)
  } catch (error) {
    throw Error("Không load được lecture")
  }

  const mockRoles: { value: string; label: string }[] = [
    { value: "USER", label: "USER" },
    { value: "ADMIN", label: "ADMIN" },
  ]

  return <UserForm mode="edit" user={user} roles={mockRoles} />
}
