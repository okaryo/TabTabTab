import { Tab } from "../../src/model/Tab"
import { TabId } from "../../src/model/TabId"

const buildTab = (id = 1, isFocused = false) => {
  return new Tab(
    new TabId(id),
    'title1',
    new URL('https://example.com/path'),
    'https://favicon.com',
    isFocused
  )
}

export default buildTab
