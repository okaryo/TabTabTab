import { Tab } from "../../src/model/Tab";

const buildTab = (id = 1, highlighted = false): Tab => {
  return {
    id: id,
    windowId: id,
    title: "title1",
    url: new URL("https://example.com/path"),
    favIconUrl: new URL("https://favicon.com"),
    highlighted,
    audible: false,
  };
};

export default buildTab;
