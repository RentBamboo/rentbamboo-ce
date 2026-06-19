import { ClerkProvider, SignedIn, SignedOut } from "@clerk/chrome-extension"
import { Outlet, useNavigate } from "react-router-dom"

import { AppSidebar } from "~components/app-sidebar"
import { CustomUserButton } from "~components/custom-user-button"

const PUBLISHABLE_KEY = process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY
const SYNC_HOST = process.env.PLASMO_PUBLIC_CLERK_SYNC_HOST

if (!PUBLISHABLE_KEY || !SYNC_HOST) {
  throw new Error(
    "Add PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY and PLASMO_PUBLIC_CLERK_SYNC_HOST to .env.development"
  )
}

export const RootLayout = () => {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      afterSignOutUrl="/"
      syncHost={SYNC_HOST}>
      <div className="flex h-[600px] w-[800px] overflow-hidden rounded-lg border border-zd-border bg-zd-white font-sans">
        {/* Sidebar — only show when signed in */}
        <SignedIn>
          <AppSidebar />
        </SignedIn>

        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <SignedIn>
            <header className="flex items-center justify-end border-b border-zd-border px-4 py-2.5">
              <CustomUserButton />
            </header>
          </SignedIn>

          <main className="flex flex-1 items-center justify-center overflow-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </ClerkProvider>
  )
}
