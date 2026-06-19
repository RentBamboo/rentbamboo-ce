import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { CountButton } from "~features/count-button"

export const config: PlasmoCSConfig = {
  matches: ["https://www.plasmo.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    const verify = async () => {
      try {
        const response = await chrome.runtime.sendMessage({
          type: "CHECK_AUTH"
        })
        if (!cancelled) setIsSignedIn(response?.isSignedIn === true)
      } catch {
        if (!cancelled) setIsSignedIn(false)
      }
    }

    verify()
    const interval = setInterval(verify, 30000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  if (!isSignedIn) return null

  return (
    <div className="z-50 flex fixed top-32 right-8">
      <CountButton />
    </div>
  )
}

export default PlasmoOverlay
