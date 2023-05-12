import { TabId } from '../model/TabId'

type DateString = string
type StoredData = {
  last_activated_at: StoredLastActivatedAt
}
type StoredLastActivatedAt = {
  [tabId: string]: DateString
}

const LAST_ACTIVATED_AT_KEY = 'last_activated_at'

export const focusTab = async (tabId: TabId) => {
  const tab = await chrome.tabs.get(tabId.value)
  const windowId = tab.windowId

  /* eslint @typescript-eslint/no-floating-promises: 0 */
  chrome.windows.update(windowId, { focused: true })
  chrome.tabs.update(tabId.value, { active: true })
}

export const removeTab = async (tabId: TabId) => {
  await chrome.tabs.remove(tabId.value)
}

export const udpateLastActivatedAtOfTab = async (tabId: TabId) => {
  let { last_activated_at } = await chrome.storage.session.get(LAST_ACTIVATED_AT_KEY) as StoredData
  if (last_activated_at === undefined) last_activated_at = {}

  last_activated_at[tabId.value] = new Date().toISOString()
  await chrome.storage.session.set({ [LAST_ACTIVATED_AT_KEY]: last_activated_at })
}

export const deleteLastActivatedAtOfTab = async (tabId: TabId) => {
  const { last_activated_at } = await chrome.storage.session.get(LAST_ACTIVATED_AT_KEY) as StoredData
  delete last_activated_at[tabId.value]
  await chrome.storage.session.set({ [LAST_ACTIVATED_AT_KEY]: last_activated_at })
}
