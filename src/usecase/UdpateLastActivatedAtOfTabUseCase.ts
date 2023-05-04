import { ChromeStorageAPI } from '../api/ChromeStorageAPI'
import { TabId } from '../model/TabId'

const UdpateLastActivatedAtOfTabUseCase = (tabId: TabId) => {
  return ChromeStorageAPI.udpateLastActivatedAtOfTab(tabId)
}

export default UdpateLastActivatedAtOfTabUseCase
