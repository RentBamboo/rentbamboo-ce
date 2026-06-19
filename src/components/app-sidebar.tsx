import { useUser } from "@clerk/chrome-extension"
import {
  House,
  Tray,
  Calendar,
  Buildings,
  Gear,
  CaretDown,
  Target,
  ChatCircle,
  Briefcase,
  Phone,
  Chats,
  Envelope,
} from "@phosphor-icons/react"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { Collapsible, CollapsibleContent } from "~components/ui/collapsible"
import { Separator } from "~components/ui/separator"
import { cn } from "~lib/utils"

interface NavItem {
  title: string
  path: string
  icon: React.ComponentType<{ className?: string; weight?: "fill" | "regular" }>
}

interface NavGroup {
  title: string
  icon: React.ComponentType<{ className?: string; weight?: "fill" | "regular" }>
  items: NavItem[]
  disabled?: boolean
}

const primaryItems: NavItem[] = [
  { title: "Home", path: "/", icon: House },
  { title: "Calendar", path: "/calendar", icon: Calendar },
]

const inboxItems: NavItem[] = [
  { title: "Unibox", path: "/inbox", icon: Tray },
  { title: "Email", path: "/inbox/email", icon: Envelope },
  { title: "SMS", path: "/inbox/sms", icon: Chats },
  { title: "Phone", path: "/inbox/phone", icon: Phone },
]

const leasingItems: NavItem[] = [
  { title: "Sales Center", path: "/sales", icon: Briefcase },
  { title: "Leads", path: "/leads", icon: Target },
  { title: "Web Chats", path: "/webchats", icon: ChatCircle },
]

const groups: NavGroup[] = [
  { title: "Inbox", icon: Tray, items: inboxItems },
  { title: "Leasing", icon: Briefcase, items: leasingItems, disabled: true },
]

const bottomItems: NavItem[] = [
  { title: "Properties", path: "/properties", icon: Buildings },
  { title: "Settings", path: "/settings", icon: Gear },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useUser()

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/"
    return location.pathname.startsWith(path)
  }

  const groupActive = (items: NavItem[]) => items.some((i) => isActive(i.path))

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    for (const g of groups) {
      initial[g.title] = groupActive(g.items)
    }
    return initial
  })

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <aside className="flex h-full w-[220px] flex-col border-r border-zd-border bg-zd-white">
      {/* Logo / Brand Header */}
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zd-teal">
          <span className="text-sm font-bold text-white">R</span>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-base font-semibold text-zd-ink">Rent</span>
          <span className="text-base font-medium text-zd-muted">Bamboo</span>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto scrollbar-thin px-2 py-3">
        {/* Primary Items */}
        {primaryItems.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
              isActive(item.path)
                ? "bg-zd-teal text-white shadow-sm"
                : "text-zd-ink hover:bg-zd-surface"
            )}
          >
            <item.icon
              className="h-4 w-4 shrink-0"
              weight="fill"
            />
            <span>{item.title}</span>
          </button>
        ))}

        {/* Collapsible Groups */}
        <div className="mt-4">
          {groups.map((group) => {
            const open = openGroups[group.title] ?? false
            const active = groupActive(group.items)
            const disabled = group.disabled ?? false

            return (
              <Collapsible
                key={group.title}
                open={open && !disabled}
                onOpenChange={() => !disabled && toggleGroup(group.title)}
              >
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && toggleGroup(group.title)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                    disabled && "cursor-not-allowed opacity-40",
                    !disabled && active
                      ? "bg-zd-teal text-white shadow-sm"
                      : !disabled && "text-zd-ink hover:bg-zd-surface"
                  )}
                >
                  <group.icon className="h-4 w-4 shrink-0" weight="fill" />
                  <span>{group.title}</span>
                  {!disabled && (
                    <CaretDown
                      className={cn(
                        "ml-auto h-3.5 w-3.5 transition-transform duration-200",
                        open && "rotate-180"
                      )}
                      weight="fill"
                    />
                  )}
                </button>

                <CollapsibleContent>
                  <div className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-zd-border pl-3">
                    {group.items.map((subItem) => (
                      <button
                        key={subItem.title}
                        onClick={() => navigate(subItem.path)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-all duration-150",
                          isActive(subItem.path)
                            ? "bg-green-50 font-medium text-green-700"
                            : "text-zd-muted hover:bg-zd-surface hover:text-zd-ink"
                        )}
                      >
                        <subItem.icon className="h-3.5 w-3.5 shrink-0" weight="fill" />
                        <span>{subItem.title}</span>
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Items */}
        <Separator className="my-2" />
        {bottomItems.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
              isActive(item.path)
                ? "bg-zd-teal text-white shadow-sm"
                : "text-zd-ink hover:bg-zd-surface"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" weight="fill" />
            <span>{item.title}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
