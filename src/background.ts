/**
 * Background service worker for the Chrome extension.
 * Handles auth status checks by reading the Clerk session cookie from the sync host.
 */

const SYNC_HOST = process.env.PLASMO_PUBLIC_CLERK_SYNC_HOST || ""

/**
 * Checks if the user has an active Clerk session by looking for the __session cookie.
 */
async function checkAuthStatus(): Promise<{ isSignedIn: boolean }> {
  if (!SYNC_HOST) {
    return { isSignedIn: false }
  }

  try {
    const cookie = await chrome.cookies.get({
      url: SYNC_HOST,
      name: "__session"
    })

    return { isSignedIn: !!cookie?.value }
  } catch (err) {
    console.error("[Resman BG] Error checking auth:", err)
    return { isSignedIn: false }
  }
}

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHECK_AUTH") {
    checkAuthStatus().then(sendResponse)
    return true
  }

  if (message.type === "TOGGLE_MODAL") {
    // Forward to the active tab's content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id
      if (tabId) {
        chrome.tabs.sendMessage(tabId, { type: "TOGGLE_MODAL" }, (response) => {
          // chrome.runtime.lastError is set if no listener exists on that tab
          if (chrome.runtime.lastError) {
            sendResponse({
              success: false,
              reason:
                "Content script not available on this page. Make sure you're on a Resman page and reload if needed."
            })
          } else {
            sendResponse(
              response || {
                success: false,
                reason: "No response from content script"
              }
            )
          }
        })
      } else {
        sendResponse({ success: false, reason: "No active tab" })
      }
    })
    return true
  }
})

export {}
