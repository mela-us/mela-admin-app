import { Button } from "@/components/ui/button"
import Link from "next/link"

export function NavLink({
  href,
  active,
  children,
  indent = false,
  size = "default",
}: {
  href: string
  active: boolean
  children: React.ReactNode
  indent?: boolean
  size?: "default" | "sm"
}) {
  return (
    <Link href={href} passHref className="text-sm font-medium text-white rounded-md">
      <Button
        variant={active ? "secondary" : "ghost"}
        size={size}
        className={`w-full justify-start rounded-lg shadow-sm transition-all duration-200 font-medium text-sm my-1
          ${active ? "" : "hover:bg-purple-500 hover:text-white"}
        } ${indent ? "pl-6" : "pl-4"}`}
      >
        {children}
      </Button>
    </Link>
  )
}

export function NavSubLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <NavLink href={href} active={active} indent={true} size="sm">
      {children}
    </NavLink>
  )
}
