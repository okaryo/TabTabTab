import { ChromeTabsAPI } from '../api/ChromeTabsAPI'
import { TabId } from '../model/TabId'

const RemoveTabUseCase = async (tabId: TabId) => {
  await ChromeTabsAPI.removeTab(tabId)
}

export default RemoveTabUseCase
