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
  get otherOperations() {
    return chrome.i18n.getMessage("other_operations");
  }
  get close() {
    return chrome.i18n.getMessage("close");
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
  get tabCleanerHeader() {
    return chrome.i18n.getMessage("tab_cleaner_header");
  }
  get tabCleanerDescription() {
    return chrome.i18n.getMessage("tab_cleaner_description");
  }
  get duration() {
    return chrome.i18n.getMessage("duration");
  }
  get unit() {
    return chrome.i18n.getMessage("unit");
  }
  get durationUnitDay() {
    return chrome.i18n.getMessage("duration_unit_day");
  }
  get durationUnitHour() {
    return chrome.i18n.getMessage("duration_unit_hour");
  }
  get popupSizeHeader() {
    return chrome.i18n.getMessage("popup_size_header");
  }
  get popupSizeDescription() {
    return chrome.i18n.getMessage("popup_size_description");
  }
  get height() {
    return chrome.i18n.getMessage("height");
  }
  get width() {
    return chrome.i18n.getMessage("width");
  }
  get save() {
    return chrome.i18n.getMessage("save");
  }
  get saving() {
    return chrome.i18n.getMessage("saving");
  }
  get savedSuccessfully() {
    return chrome.i18n.getMessage("saved_successfully");
  }
  get savedError() {
    return chrome.i18n.getMessage("saved_error");
  }
  get popupSizeValidationErrorValueFormat() {
    return chrome.i18n.getMessage("popup_size_validation_error_value_format");
  }
  get popupSizeValidationErrorValueRange() {
    return chrome.i18n.getMessage("popup_size_validation_error_value_range");
  }
  get tabCleanerValidationErrorValueFormat() {
    return chrome.i18n.getMessage("tab_cleaner_validation_error_value_format");
  }
  get tabCleanerErrorOnSave() {
    return chrome.i18n.getMessage("tab_cleaner_error_on_save");
  }
  get settings() {
    return chrome.i18n.getMessage("settings");
  }
  get feedback() {
    return chrome.i18n.getMessage("feedback");
  }
  get bugReportAndFeatureRequestTitle() {
    return chrome.i18n.getMessage("bug_report_and_feature_request_title");
  }
  get bugReportAndFeatureRequestDescription() {
    return chrome.i18n.getMessage("bug_report_and_feature_request_description");
  }
  get storeReviewTitle() {
    return chrome.i18n.getMessage("store_review_title");
  }
  get storeReviewDescription() {
    return chrome.i18n.getMessage("store_review_description");
  }
  get sourceCodeTitle() {
    return chrome.i18n.getMessage("source_code_title");
  }
  get sourceCodeDescription() {
    return chrome.i18n.getMessage("source_code_description");
  }
}

const t = new Translations();

export default t;
