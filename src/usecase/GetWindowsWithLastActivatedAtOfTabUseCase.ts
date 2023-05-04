import { ChromeStorageAPI } from '../api/ChromeStorageAPI'
import { TbWindows } from '../model/Windows'

const GetWindowsWithLastActivatedAtOfTabUseCase = (tbWindows: TbWindows): Promise<TbWindows> => {
  return ChromeStorageAPI.getWindowsWithLastActivatedAtOfTab(tbWindows)
}

export default GetWindowsWithLastActivatedAtOfTabUseCase
