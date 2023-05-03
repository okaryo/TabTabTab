import { ChromeTabsAPI } from '../api/ChromeTabsAPI'
import { TabId } from '../model/TabId'

const FocusTabUseCase = async (tabId: TabId) => {
  await ChromeTabsAPI.focusTab(tabId)
}

export default FocusTabUseCase
