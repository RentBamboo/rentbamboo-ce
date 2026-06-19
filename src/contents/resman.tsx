import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useCallback, useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://*.myresman.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

// Ensure the Plasmo shadow host doesn't block page interactions
export const getShadowHostId = () => "resman-overlay"

interface Prospect {
  name: string
  lastContact: string
  movingFrom: string
  dateNeeded: string
  phone: string
  email: string
  leasingAgent: string
  lost: string
  applied: string
  detailUrl: string
}

/**
 * Parses the prospect table from the page DOM
 */
function parseProspectTable(): Prospect[] {
  const rows = document.querySelectorAll("table.styled-table tbody tr.prospect")
  const prospects: Prospect[] = []

  rows.forEach((row) => {
    const nameEl = row.querySelector(".pl-name-col a.ajax")
    const contactCol = row.querySelector(".pl-contact-col")
    const movingCol = row.querySelector(".pl-moving-col .oe-tip")
    const neededCol = row.querySelector(".pl-needed-col")
    const phoneCol = row.querySelector(".pl-phone-col")
    const emailEl = row.querySelector(".pl-email-col a.email")
    const agentEl = row.querySelector(".pl-agent-col a.ajax")
    const lostCol = row.querySelector(".pl-lostprospect-col")
    const appliedCol = row.querySelector(".pl-appliedprospect-col")

    prospects.push({
      name: nameEl?.textContent?.trim() || "",
      lastContact: contactCol?.textContent?.trim() || "",
      movingFrom: movingCol?.textContent?.trim() || "",
      dateNeeded: neededCol?.textContent?.trim() || "",
      phone: phoneCol?.textContent?.trim() || "",
      email: emailEl?.textContent?.trim() || "",
      leasingAgent: agentEl?.textContent?.trim() || "",
      lost: lostCol?.textContent?.trim() || "",
      applied: appliedCol?.textContent?.trim() || "",
      detailUrl: nameEl?.getAttribute("href") || ""
    })
  })

  return prospects
}

/**
 * Clicks the "Last contact" sort header twice for descending sort (most recent first)
 */
async function sortByLastContactDesc(): Promise<void> {
  const sortLink = document.querySelector(
    'th.pl-contact-col a[sort-by="LastContact"]'
  ) as HTMLElement | null
  if (!sortLink) return

  // Click once (ascending)
  sortLink.click()
  await waitForTableUpdate()

  // Click again (descending - most recent first)
  const sortLinkAgain = document.querySelector(
    'th.pl-contact-col a[sort-by="LastContact"]'
  ) as HTMLElement | null
  if (sortLinkAgain) {
    sortLinkAgain.click()
    await waitForTableUpdate()
  }
}

/**
 * Sets the date range to last 7 days and clicks Go
 */
async function setDateRange(daysBack: number): Promise<void> {
  const dateRangePicker = document.getElementById(
    "DateRangePicker"
  ) as HTMLInputElement | null
  if (!dateRangePicker) return

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - daysBack)

  const formatDate = (d: Date) =>
    `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`

  const startStr = formatDate(startDate)
  const endStr = formatDate(endDate)

  // Update the date range picker attributes and value
  dateRangePicker.setAttribute("data-start", startStr)
  dateRangePicker.setAttribute("data-end", endStr)
  dateRangePicker.value = `${startStr} - ${endStr}`

  // Trigger change event
  dateRangePicker.dispatchEvent(new Event("change", { bubbles: true }))

  // Click the Go button
  const goButton = document.getElementById("Go") as HTMLElement | null
  if (goButton) {
    goButton.click()
    await waitForTableUpdate()
  }
}

async function setDateRangeLast7Days(): Promise<void> {
  return setDateRange(7)
}

async function setDateRangeToday(): Promise<void> {
  return setDateRange(0)
}

async function clearDateRange(): Promise<void> {
  const dateRangePicker = document.getElementById(
    "DateRangePicker"
  ) as HTMLInputElement | null
  if (!dateRangePicker) return

  // Clear the date range picker
  dateRangePicker.setAttribute("data-start", "")
  dateRangePicker.setAttribute("data-end", "")
  dateRangePicker.value = ""

  // Trigger change event
  dateRangePicker.dispatchEvent(new Event("change", { bubbles: true }))

  // Click the Go button
  const goButton = document.getElementById("Go") as HTMLElement | null
  if (goButton) {
    goButton.click()
    await waitForTableUpdate()
  }
}

/**
 * Parses all pages by clicking through pagination links and collecting prospects.
 * Re-queries pagination after each navigation to handle sliding page-link windows.
 */
async function parseAllPages(
  onProgress?: (msg: string) => void
): Promise<Prospect[]> {
  const allProspects: Prospect[] = []
  const visitedPages = new Set<string>()
  let pagesParsed = 0

  // Detect the current page number
  const currentPage = document.querySelector(
    "#PageLinks span.link.list.page.selected, #PageLinks span.current"
  ) as HTMLElement | null
  const currentPageNum = currentPage?.textContent?.trim() || "1"

  // Parse the current page
  const firstPageProspects = parseProspectTable()
  allProspects.push(...firstPageProspects)
  visitedPages.add(currentPageNum)
  pagesParsed++
  onProgress?.(
    `Page ${currentPageNum}: ${firstPageProspects.length} prospects (${pagesParsed} pages parsed)`
  )

  // Keep navigating until no unvisited page links remain
  let hasMore = true
  while (hasMore) {
    hasMore = false

    // Re-query page links fresh from the DOM each iteration
    const pageLinks = document.querySelectorAll(
      "#PageLinks span.link.list.page"
    )

    for (let i = 0; i < pageLinks.length; i++) {
      const link = pageLinks[i] as HTMLElement
      const pageNum = link.textContent?.trim() || ""

      if (!pageNum || visitedPages.has(pageNum)) continue

      onProgress?.(
        `Loading page ${pageNum}... (${pagesParsed} pages parsed so far, ${allProspects.length} prospects)`
      )

      link.click()
      await waitForTableUpdate()
      // Extra settle time for AJAX
      await new Promise((r) => setTimeout(r, 600))

      const pageProspects = parseProspectTable()
      allProspects.push(...pageProspects)
      visitedPages.add(pageNum)
      pagesParsed++
      onProgress?.(
        `Page ${pageNum}: ${pageProspects.length} prospects (${pagesParsed} pages parsed, ${allProspects.length} total)`
      )

      // After clicking, the pagination DOM may have changed — break and re-query
      hasMore = true
      break
    }
  }

  return allProspects
}

/**
 * Waits for the table to update after an action
 */
function waitForTableUpdate(timeout = 3000): Promise<void> {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations, obs) => {
      // Look for changes in the prospect list area
      const hasRelevantChange = mutations.some(
        (m) =>
          m.target instanceof HTMLElement &&
          (m.target.id === "ProspectList" ||
            m.target.closest?.("#ProspectList"))
      )
      if (hasRelevantChange) {
        obs.disconnect()
        // Small delay to let the DOM settle
        setTimeout(resolve, 300)
      }
    })

    const prospectList = document.getElementById("ProspectList")
    if (prospectList) {
      observer.observe(prospectList, { childList: true, subtree: true })
    }

    // Fallback timeout
    setTimeout(() => {
      observer.disconnect()
      resolve()
    }, timeout)
  })
}

/**
 * Checks auth status via the background service worker.
 * Returns true if the user has an active Clerk session.
 */
async function checkAuth(): Promise<boolean> {
  try {
    const response = await chrome.runtime.sendMessage({ type: "CHECK_AUTH" })
    return response?.isSignedIn === true
  } catch (err) {
    console.warn("[Resman] Auth check failed:", err)
    return false
  }
}

const ResmanOverlay = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null)
  const [isOnProspects, setIsOnProspects] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState("")

  // Check auth on mount and periodically
  useEffect(() => {
    let cancelled = false

    const verify = async () => {
      const signedIn = await checkAuth()
      if (!cancelled) setIsSignedIn(signedIn)
    }

    verify()

    // Re-check auth every 30 seconds in case session expires or user signs in
    const interval = setInterval(verify, 30000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  // Listen for TOGGLE_MODAL messages from popup/background
  useEffect(() => {
    const listener = (
      message: any,
      _sender: any,
      sendResponse: (r: any) => void
    ) => {
      if (message.type === "TOGGLE_MODAL") {
        setIsDismissed(false)
        setIsVisible((prev) => !prev)
        sendResponse({ success: true })
      }
    }

    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  // Toggle pointer-events on the Plasmo shadow host element
  useEffect(() => {
    const host = document.getElementById("resman-overlay")
    if (host) {
      if (isVisible) {
        host.style.pointerEvents = "auto"
      } else {
        host.style.pointerEvents = "none"
      }
    }
  }, [isVisible])

  useEffect(() => {
    const checkHash = () => {
      const onProspects = window.location.hash.startsWith("#/Prospects")
      setIsOnProspects(onProspects)
      if (onProspects && !isDismissed) {
        setTimeout(() => setIsVisible(true), 2000)
      } else {
        setIsVisible(false)
      }
    }

    checkHash()

    window.addEventListener("hashchange", checkHash)
    return () => window.removeEventListener("hashchange", checkHash)
  }, [isDismissed])

  /**
   * Get all leads (all time) (all pages) - clears date filter, then parses every page
   */
  const handleGetAllLeadsAllTime = useCallback(async () => {
    setIsLoading(true)
    setStatus("Clearing date range filter...")

    try {
      await clearDateRange()
      setStatus("Sorting by last contact (most recent first)...")

      await sortByLastContactDesc()
      setStatus("Parsing all pages...")

      await new Promise((r) => setTimeout(r, 500))

      const all = await parseAllPages((msg) => setStatus(msg))
      setProspects(all)
      setStatus(`Done! ${all.length} total prospects across all pages`)
    } catch (err) {
      setStatus(
        `Error: ${err instanceof Error ? err.message : "Unknown error"}`
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Get all leads (7 days) - sets 7-day range, sort by last contact desc, then parse ALL pages
   */
  const handleGetAllLeads7Days = useCallback(async () => {
    setIsLoading(true)
    setStatus("Setting date range to last 7 days...")

    try {
      await setDateRangeLast7Days()
      setStatus("Sorting by last contact (most recent first)...")

      await sortByLastContactDesc()
      setStatus("Parsing all pages...")

      await new Promise((r) => setTimeout(r, 500))

      const all = await parseAllPages((msg) => setStatus(msg))
      setProspects(all)
      setStatus(`Done! ${all.length} total prospects across all pages`)
    } catch (err) {
      setStatus(
        `Error: ${err instanceof Error ? err.message : "Unknown error"}`
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Get leads on this page - parse without changing filters (just read what's currently visible)
   */
  const handleGetLeadsOnThisPage = useCallback(() => {
    const parsed = parseProspectTable()
    setProspects(parsed)
    setStatus(`Parsed ${parsed.length} prospects from current page`)
  }, [])

  /**
   * Leads today - sets date range to today, sorts, and parses all pages
   */
  const handleLeadsToday = useCallback(async () => {
    setIsLoading(true)
    setStatus("Setting date range to today...")

    try {
      await setDateRangeToday()
      setStatus("Sorting by last contact (most recent first)...")

      await sortByLastContactDesc()
      setStatus("Parsing all pages...")

      await new Promise((r) => setTimeout(r, 500))

      const all = await parseAllPages((msg) => setStatus(msg))
      setProspects(all)
      setStatus(`Done! ${all.length} total prospects from today`)
    } catch (err) {
      setStatus(
        `Error: ${err instanceof Error ? err.message : "Unknown error"}`
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Don't render anything if auth hasn't resolved or user isn't signed in
  if (isSignedIn === null || !isSignedIn) return null

  if (!isOnProspects) return null

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}>
      <div
        className={`bg-white rounded-lg shadow-2xl w-[680px] max-h-[80vh] p-6 transition-all duration-500 flex flex-col ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Resman Prospect Leads
          </h2>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => {
                setIsOnProspects(false)
                setIsDismissed(true)
              }, 500)
            }}
            className="text-gray-400 hover:text-gray-600 cursor-pointer border-none bg-transparent p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleGetAllLeadsAllTime}
            disabled={isLoading}
            className="px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer border-none">
            {isLoading ? "Loading..." : "All Leads"}
          </button>
          <button
            onClick={handleGetAllLeads7Days}
            disabled={isLoading}
            className="px-3 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 cursor-pointer border-none">
            Last 7 Days
          </button>
          <button
            onClick={handleGetLeadsOnThisPage}
            disabled={isLoading}
            className="px-3 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 disabled:opacity-50 cursor-pointer border-none">
            This Page
          </button>
          <button
            onClick={handleLeadsToday}
            disabled={isLoading}
            className="px-3 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50 cursor-pointer border-none">
            Today
          </button>
        </div>

        {/* Status */}
        {status && <div className="text-sm text-gray-500 mb-3">{status}</div>}

        {/* Prospect list */}
        <div className="overflow-y-auto flex-1 min-h-0">
          {prospects.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th className="text-left p-2 border-b font-medium text-gray-700">
                    Name
                  </th>
                  <th className="text-left p-2 border-b font-medium text-gray-700">
                    Last Contact
                  </th>
                  <th className="text-left p-2 border-b font-medium text-gray-700">
                    Phone
                  </th>
                  <th className="text-left p-2 border-b font-medium text-gray-700">
                    Email
                  </th>
                  <th className="text-left p-2 border-b font-medium text-gray-700">
                    Agent
                  </th>
                  <th className="text-left p-2 border-b font-medium text-gray-700">
                    Date Needed
                  </th>
                </tr>
              </thead>
              <tbody>
                {prospects.map((p, i) => (
                  <tr
                    key={i}
                    className="hover:bg-blue-50 border-b border-gray-100">
                    <td className="p-2 font-medium text-gray-900 whitespace-nowrap">
                      {p.name}
                    </td>
                    <td className="p-2 text-gray-600 whitespace-nowrap">
                      {p.lastContact}
                    </td>
                    <td className="p-2 text-gray-600 whitespace-nowrap">
                      {p.phone || "—"}
                    </td>
                    <td className="p-2 text-blue-600 truncate max-w-[160px]">
                      {p.email || "—"}
                    </td>
                    <td className="p-2 text-gray-600 whitespace-nowrap">
                      {p.leasingAgent}
                    </td>
                    <td className="p-2 text-gray-600 whitespace-nowrap">
                      {p.dateNeeded || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-400">
              Click a button above to load prospects
            </div>
          )}
        </div>

        {/* Footer summary */}
        {prospects.length > 0 && (
          <div className="mt-3 pt-3 border-t text-xs text-gray-500 flex justify-between">
            <span>{prospects.length} prospects loaded</span>
            <span>
              Agents:{" "}
              {[
                ...new Set(prospects.map((p) => p.leasingAgent).filter(Boolean))
              ].join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResmanOverlay
