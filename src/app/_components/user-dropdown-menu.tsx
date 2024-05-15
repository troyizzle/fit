"use client"

import { type User } from "next-auth"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"

interface UserDropdownMenuProps {
  user: User
}

export default function UserDropdownMenu({ user }: UserDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          {user.image ? <AvatarImage src={user.image} alt={user.name ?? 'user avatar'} /> : null}
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
