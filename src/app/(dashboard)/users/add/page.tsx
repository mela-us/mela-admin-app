import UserForm from "@/components/users/user-form"

// Mock data for roles
const mockRoles: { value: string; label: string }[] = [
  { value: "USER", label: "USER" },
  { value: "ADMIN", label: "ADMIN" },
]

export default function AddUserPage() {
  return <UserForm mode="add" roles={mockRoles} />
}
