import { TabId } from '../model/TabId'
import { TbWindows } from '../model/Windows'

type DateString = string
type StoredData = {
  last_activated_at: StoredLastActivatedAt
}
type StoredLastActivatedAt = {
  [tabId: string]: DateString
}

export class ChromeStorageAPI {
  static readonly LAST_ACTIVATED_AT_KEY = 'last_activated_at'

  static async getWindowsWithLastActivatedAtOfTab(tbWindows: TbWindows): Promise<TbWindows> {
    let newWindows = tbWindows
    const { last_activated_at } = await chrome.storage.session.get(this.LAST_ACTIVATED_AT_KEY) as StoredData
    if (!last_activated_at || Object.keys(last_activated_at).length === 0) return tbWindows

    for (const [tabId, dateString] of Object.entries(last_activated_at)) {
      console.log(tabId, dateString)
      newWindows = newWindows.updateLastActivatedAtOfTabBy(new TabId(Number(tabId)), new Date(dateString))
    }
    console.log(newWindows)
    return newWindows
  }

  static async udpateLastActivatedAtOfTab(tabId: TabId) {
    let { last_activated_at } = await chrome.storage.session.get(this.LAST_ACTIVATED_AT_KEY) as StoredData
    if (last_activated_at === undefined) last_activated_at = {}

    last_activated_at[tabId.value] = new Date().toISOString()
    await chrome.storage.session.set({ [this.LAST_ACTIVATED_AT_KEY]: last_activated_at })
  }

  static async deleteLastActivatedAtOfTab(tabId: TabId) {
    const storedLastActivatedAt: StoredLastActivatedAt = await chrome.storage.session.get(this.LAST_ACTIVATED_AT_KEY)
    delete storedLastActivatedAt[tabId.value]
    await chrome.storage.session.set({ [this.LAST_ACTIVATED_AT_KEY]: storedLastActivatedAt })
  }
}
