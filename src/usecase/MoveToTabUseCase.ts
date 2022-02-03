import { ChromeTabsAPI } from '../api/ChromeTabsAPI'
import { TabId } from '../model/TabId'

const MoveToTabUseCase = async (tabId: TabId) => {
  await ChromeTabsAPI.moveToTab(tabId)
}

export default MoveToTabUseCase
