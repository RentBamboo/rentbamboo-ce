import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton
} from "@clerk/chrome-extension"
import { Lightning } from "@phosphor-icons/react"
import { useCallback, useState } from "react"

export const HomePage = () => {
  const [modalStatus, setModalStatus] = useState<{
    text: string
    isError: boolean
  } | null>(null)

  const handleToggleModal = useCallback(async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: "TOGGLE_MODAL"
      })
      if (response?.success) {
        setModalStatus({ text: "✓ Modal toggled", isError: false })
      } else {
        setModalStatus({
          text: response?.reason || "Could not reach content script",
          isError: true
        })
      }
    } catch (err) {
      setModalStatus({
        text: "Not on a Resman page — navigate there first",
        isError: true
      })
    }
    setTimeout(() => setModalStatus(null), 3000)
  }, [])

  return (
    <>
      <SignedOut>
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zd-teal/10">
              <Lightning className="h-6 w-6 text-zd-teal" weight="fill" />
            </div>
            <h2 className="text-lg font-semibold text-zd-ink">
              Welcome to RentBamboo
            </h2>
            <p className="text-sm text-zd-muted">Sign in to get started</p>
          </div>
          <div className="flex gap-3">
            <SignInButton mode="modal">
              <button className="rounded-lg bg-zd-teal px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zd-teal-dark">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-lg border border-zd-border px-4 py-2 text-sm font-medium text-zd-ink transition-colors hover:bg-zd-surface">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleToggleModal}
            className="flex items-center gap-2 rounded-lg bg-zd-teal px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zd-teal-dark focus:outline-none focus:ring-2 focus:ring-zd-teal/30 focus:ring-offset-2">
            <Lightning className="h-4 w-4" weight="fill" />
            Toggle Resman Assistant
          </button>
          {modalStatus && (
            <p
              className={`text-xs ${
                modalStatus.isError ? "text-red-500" : "text-green-600"
              }`}>
              {modalStatus.text}
            </p>
          )}
        </div>
      </SignedIn>
    </>
  )
}
