import { ChromeTabsAPI } from '../api/ChromeTabsAPI'
import { TabId } from '../model/TabId'

const MoveToTabUseCase = (tabId: TabId) => {
  ChromeTabsAPI.moveToTab(tabId)
}

export default MoveToTabUseCase
