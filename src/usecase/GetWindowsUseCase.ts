import { ChromeTabsAPI } from '../api/ChromeTabsAPI'
import { TbWindows } from '../model/Windows'

const GetWindowsUseCase = async (): Promise<TbWindows> => {
  const focusedWindow = await ChromeTabsAPI.getCurrentWindow()
  const unfocusedWindows = await ChromeTabsAPI.getUnfocusedWindows()
  return new TbWindows([focusedWindow, ...(unfocusedWindows.values)])
}

export default GetWindowsUseCase
