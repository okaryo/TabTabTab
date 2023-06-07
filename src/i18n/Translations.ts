class Translations {
  // config
  get local() {
    return chrome.i18n.getMessage("@@ui_locale");
  }

  // Windows
  get window() {
    return chrome.i18n.getMessage("window");
  }
  get currentWindow() {
    return chrome.i18n.getMessage("current_window");
  }

  // Grouped Tabs
  get pinned() {
    return chrome.i18n.getMessage("pinned");
  }

  // Tab
  elapsedTime(time: number, unit: string) {
    if (this.local === "ja") return `${time}${unit}${this.ago}`;

    return `${time}${unit} ${this.ago}`;
  }
  get month() {
    return chrome.i18n.getMessage("month");
  }
  get months() {
    return chrome.i18n.getMessage("months");
  }
  get week() {
    return chrome.i18n.getMessage("week");
  }
  get weeks() {
    return chrome.i18n.getMessage("weeks");
  }
  get day() {
    return chrome.i18n.getMessage("day");
  }
  get days() {
    return chrome.i18n.getMessage("days");
  }
  get hour() {
    return chrome.i18n.getMessage("hour");
  }
  get hours() {
    return chrome.i18n.getMessage("hours");
  }
  get min() {
    return chrome.i18n.getMessage("min");
  }
  get mins() {
    return chrome.i18n.getMessage("mins");
  }
  get sec() {
    return chrome.i18n.getMessage("sec");
  }
  get secs() {
    return chrome.i18n.getMessage("secs");
  }
  get ago() {
    return chrome.i18n.getMessage("ago");
  }
  get bookmark() {
    return chrome.i18n.getMessage("bookmark");
  }
  get copyUrl() {
    return chrome.i18n.getMessage("copy_url");
  }
  get pin() {
    return chrome.i18n.getMessage("pin");
  }
  get screenshotVisibleArea() {
    return chrome.i18n.getMessage("screenshot_visible_area");
  }
  get duplicated() {
    return chrome.i18n.getMessage("duplicated");
  }
}

const t = new Translations();

export default t;
