import { useAuth } from "@clerk/chrome-extension"
import { useCallback } from "react"

const API_BASE = process.env.PLASMO_PUBLIC_CLERK_SYNC_HOST || "http://localhost:3000"

/**
 * Hook for making authenticated requests to your Next.js API.
 * Automatically attaches the Clerk session token as a Bearer header,
 * avoiding the Origin/Authorization conflict in Chrome extensions.
 *
 * Usage:
 *   const { fetchWithAuth } = useAuthFetch()
 *   const data = await fetchWithAuth("/api/protected")
 */
export function useAuthFetch() {
  const { getToken, isSignedIn } = useAuth()

  const fetchWithAuth = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const token = await getToken()

      if (!token) {
        throw new Error("No auth token available — is the user signed in?")
      }

      const url = path.startsWith("http") ? path : `${API_BASE}${path}`

      const res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) {
        throw new Error(`API error ${res.status}: ${await res.text()}`)
      }

      return res.json()
    },
    [getToken]
  )

  return { fetchWithAuth, isSignedIn }
}
