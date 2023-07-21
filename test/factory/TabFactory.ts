import { Tab } from "../../src/model/Tab";

const buildTab = (id = 1, isFocused = false): Tab => {
  return {
    id: id,
    windowId: id,
    title: "title1",
    url: new URL("https://example.com/path"),
    favIconUrl: "https://favicon.com",
    isFocused,
    isAudioPlaying: false,
  };
};

export default buildTab;
