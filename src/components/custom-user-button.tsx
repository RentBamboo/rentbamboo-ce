import { useClerk, useUser } from "@clerk/chrome-extension"
import {
  SignOut,
  Gear,
  User,
  CaretDown,
} from "@phosphor-icons/react"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "~components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~components/ui/dropdown-menu"
import { cn } from "~lib/utils"

export function CustomUserButton() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [open, setOpen] = useState(false)

  if (!user) return null

  const initials = [user.firstName?.[0], user.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || "U"

  const displayName = user.fullName || user.emailAddresses[0]?.emailAddress || "User"
  const email = user.emailAddresses[0]?.emailAddress || ""

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all duration-150",
            "hover:bg-zd-surface focus:outline-none focus:ring-2 focus:ring-zd-teal/30",
            open && "bg-zd-surface"
          )}
        >
          <Avatar className="h-8 w-8 ring-2 ring-zd-teal/20">
            <AvatarImage src={user.imageUrl} alt={displayName} />
            <AvatarFallback className="bg-zd-teal text-white text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium text-zd-ink leading-tight">
              {displayName}
            </span>
            <span className="text-[11px] text-zd-muted leading-tight">
              {email}
            </span>
          </div>
          <CaretDown
            className={cn(
              "h-3.5 w-3.5 text-zd-muted transition-transform duration-200",
              open && "rotate-180"
            )}
            weight="fill"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2.5 py-1">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.imageUrl} alt={displayName} />
              <AvatarFallback className="bg-zd-teal text-white text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zd-ink">{displayName}</span>
              <span className="text-[11px] text-zd-muted">{email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="h-4 w-4" weight="fill" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Gear className="h-4 w-4" weight="fill" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-red-600 hover:text-red-700 focus:text-red-700"
        >
          <SignOut className="h-4 w-4" weight="fill" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
