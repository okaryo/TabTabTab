import { Tab } from "../../src/model/Tab";
import { TabId } from "../../src/model/TabId";
import { WindowId } from "../../src/model/WindowId";

const buildTab = (id = 1, isFocused = false): Tab => {
  return {
    id: new TabId(id),
    windowId: new WindowId(id),
    title: "title1",
    url: new URL("https://example.com/path"),
    favIconUrl: "https://favicon.com",
    isFocused,
    isAudioPlaying: false,
  };
};

export default buildTab;
