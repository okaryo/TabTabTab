class Translations {
  // config
  get locale() {
    return chrome.i18n.getMessage("@@ui_locale");
  }

  // Windows
  get window() {
    return chrome.i18n.getMessage("window");
  }
  get currentWindow() {
    return chrome.i18n.getMessage("current_window");
  }
  get addWindow() {
    return chrome.i18n.getMessage("add_window");
  }
  get saveWindow() {
    return chrome.i18n.getMessage("save_window");
  }
  get mergeRightWindow() {
    return chrome.i18n.getMessage("merge_right_window");
  }
  get mergeLeftWindow() {
    return chrome.i18n.getMessage("merge_left_window");
  }
  get closeWindow() {
    return chrome.i18n.getMessage("close_window");
  }
  get noStoredWindowHeader() {
    return chrome.i18n.getMessage("no_stored_window_header");
  }
  get noStoredWindowDescription() {
    return chrome.i18n.getMessage("no_stored_window_description");
  }

  // Grouped Tabs
  get pinned() {
    return chrome.i18n.getMessage("pinned");
  }
  get tabGroup() {
    return chrome.i18n.getMessage("tab_group");
  }
  get noStoredTabGroupHeader() {
    return chrome.i18n.getMessage("no_stored_tab_group_header");
  }
  get noStoredTabGroupDescription() {
    return chrome.i18n.getMessage("no_stored_tab_group_description");
  }

  // Tab
  elapsedTime(time: number, unit: string) {
    if (this.locale === "ja") return `${time}${unit}${this.ago}`;
    if (this.locale === "de") return `${this.ago} ${time} ${unit}`;

    return `${time} ${unit} ${this.ago}`;
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
  get searchTabs() {
    return chrome.i18n.getMessage("search_tabs");
  }
  get noResultsFound() {
    return chrome.i18n.getMessage("no_results_found");
  }
  get recentActiveTabsHeader() {
    return chrome.i18n.getMessage("recent_active_tabs_header");
  }
  get openSidePanel() {
    return chrome.i18n.getMessage("open_side_panel");
  }
  get openDashboard() {
    return chrome.i18n.getMessage("open_dashboard");
  }
  get copyUrl() {
    return chrome.i18n.getMessage("copy_url");
  }
  get pin() {
    return chrome.i18n.getMessage("pin");
  }
  get unpin() {
    return chrome.i18n.getMessage("unpin");
  }
  get addToNewGroup() {
    return chrome.i18n.getMessage("add_to_new_group");
  }
  get removeFromGroup() {
    return chrome.i18n.getMessage("remove_from_group");
  }
  get screenshotVisibleArea() {
    return chrome.i18n.getMessage("screenshot_visible_area");
  }
  get saveTabGroup() {
    return chrome.i18n.getMessage("save_tab_group");
  }
  get ungroup() {
    return chrome.i18n.getMessage("ungroup");
  }
  get closeGroup() {
    return chrome.i18n.getMessage("close_group");
  }
  get unpinAll() {
    return chrome.i18n.getMessage("unpin_all");
  }
  get closeAll() {
    return chrome.i18n.getMessage("close_all");
  }
  get duplicated() {
    return chrome.i18n.getMessage("duplicated");
  }
  get resolveDuplicates() {
    return chrome.i18n.getMessage("resolve_duplicates");
  }
  get popupSettingHeader() {
    return chrome.i18n.getMessage("popup_setting_header");
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
  get scale() {
    return chrome.i18n.getMessage("scale");
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
  get popupElementScaleHeader() {
    return chrome.i18n.getMessage("popup_element_scale_header");
  }
  get popupElementScaleDescription() {
    return chrome.i18n.getMessage("popup_element_scale_description");
  }
  get popupElementScaleValidationErrorValueFormat() {
    return chrome.i18n.getMessage(
      "popup_element_scale_validation_error_value_format",
    );
  }
  get popupElementScaleValidationErrorValueRange() {
    return chrome.i18n.getMessage(
      "popup_element_scale_validation_error_value_range",
    );
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

  // OptionsHeader
  get optionsNavigationAllWindows() {
    return chrome.i18n.getMessage("options_navigation_all_windows");
  }
  get optionsNavigationRestore() {
    return chrome.i18n.getMessage("options_navigation_restore");
  }
  get optionsNavigationOrganization() {
    return chrome.i18n.getMessage("options_navigation_organization");
  }
  get optionsNavigationSettings() {
    return chrome.i18n.getMessage("options_navigation_settings");
  }
  get optionsNavigationFeedback() {
    return chrome.i18n.getMessage("options_navigation_feedback");
  }
  get optionsNavigationSponsor() {
    return chrome.i18n.getMessage("options_navigation_sponsor");
  }

  // OrganizationPage
  get cleanupTabsHeader() {
    return chrome.i18n.getMessage("cleanup_tabs_header");
  }
  get tabCleanerHeader() {
    return chrome.i18n.getMessage("tab_cleaner_header");
  }
  get tabCleanerDescription() {
    return chrome.i18n.getMessage("tab_cleaner_description");
  }
  get tabCleanerValidationErrorValueFormat() {
    return chrome.i18n.getMessage("tab_cleaner_validation_error_value_format");
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
  get tabGroupingHeader() {
    return chrome.i18n.getMessage("tab_grouping_header");
  }
  get tabGroupingGroupTabsNow() {
    return chrome.i18n.getMessage("tab_grouping_group_tabs_now");
  }
  get tabGroupingGroupTabsAutomatically() {
    return chrome.i18n.getMessage("tab_grouping_group_tabs_automatically");
  }
  get tabGroupingDetailSettingsSubheader() {
    return chrome.i18n.getMessage("tab_grouping_detail_settings_subheader");
  }
  get tabGroupingAutoCollapseUnusedTabGroups() {
    return chrome.i18n.getMessage(
      "tab_grouping_auto_collapse_unused_tab_groups",
    );
  }
  get tabGroupingAutoUngroupSingleTabGroups() {
    return chrome.i18n.getMessage(
      "tab_grouping_auto_ungroup_single_tab_groups",
    );
  }
  get tabGroupingApplyAutoGroupingToCurrentTabOnly() {
    return chrome.i18n.getMessage(
      "tab_grouping_apply_auto_grouping_to_current_tab_only",
    );
  }
  get tabGroupingApplyAutoGroupingToCurrentTabOnlyDescription() {
    return chrome.i18n.getMessage(
      "tab_grouping_apply_auto_grouping_to_current_tab_only_description",
    );
  }
  get tabGroupingGroupTabsBy() {
    return chrome.i18n.getMessage("tab_grouping_group_tabs_by");
  }
  get tabGroupingGroupTabsByMenuItemDomain() {
    return chrome.i18n.getMessage(
      "tab_grouping_group_tabs_by_menu_item_domain",
    );
  }
  get tabGroupingGroupTabsByMenuItemSubdomain() {
    return chrome.i18n.getMessage(
      "tab_grouping_group_tabs_by_menu_item_subdomain",
    );
  }

  // SponsorPage
  get sponsorPageHeader() {
    return chrome.i18n.getMessage("sponsor_page_header");
  }
  get sponsorPageDescription() {
    return chrome.i18n.getMessage("sponsor_page_description");
  }
}

const t = new Translations();

export default t;
