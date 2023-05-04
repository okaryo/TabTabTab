import { ChromeStorageAPI } from '../api/ChromeStorageAPI'
import { TabId } from '../model/TabId'

const DeleteLastActivatedAtOfTabUseCase = (tabId: TabId) => {
  return ChromeStorageAPI.deleteLastActivatedAtOfTab(tabId)
}

export default DeleteLastActivatedAtOfTabUseCase
