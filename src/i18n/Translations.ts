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
  get saveAllWindows() {
    return chrome.i18n.getMessage("save_all_windows");
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
  get saveCurrentWindow() {
    return chrome.i18n.getMessage("save_current_window");
  }
  get newTabTitleFormPlaceholderToStored() {
    return chrome.i18n.getMessage("new_tab_title_form_placeholder_to_stored");
  }
  get newTabFormSiteFetchError() {
    return chrome.i18n.getMessage("new_tab_form_site_fetch_error");
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
  get url() {
    return chrome.i18n.getMessage("url");
  }
  get cancel() {
    return chrome.i18n.getMessage("cancel");
  }
  get add() {
    return chrome.i18n.getMessage("add");
  }
  get searchTabs() {
    return chrome.i18n.getMessage("search_tabs");
  }
  get noResultsFound() {
    return chrome.i18n.getMessage("no_results_found");
  }
  get groupTabsSearchResultTabs() {
    return chrome.i18n.getMessage("group_tabs_search_result_tabs");
  }
  get groupTabsSearchResultTabsDescription() {
    return chrome.i18n.getMessage("group_tabs_search_result_tabs_description");
  }
  get recentActiveTabsHeader() {
    return chrome.i18n.getMessage("recent_active_tabs_header");
  }
  get openSidePanel() {
    return chrome.i18n.getMessage("open_side_panel");
  }
  get closeSidePanel() {
    return chrome.i18n.getMessage("close_side_panel");
  }
  get openDashboard() {
    return chrome.i18n.getMessage("open_dashboard");
  }
  get rateAndReview() {
    return chrome.i18n.getMessage("rate_and_review");
  }
  get joinDiscussions() {
    return chrome.i18n.getMessage("join_discussions");
  }
  get sponsorProject() {
    return chrome.i18n.getMessage("sponsor_project");
  }
  get copyUrl() {
    return chrome.i18n.getMessage("copy_url");
  }
  get duplicateTab() {
    return chrome.i18n.getMessage("duplicate_tab");
  }
  get addNewTabNext() {
    return chrome.i18n.getMessage("add_new_tab_next");
  }
  get addNewTabInGroup() {
    return chrome.i18n.getMessage("add_new_tab_in_group");
  }
  get addNewTabInWindow() {
    return chrome.i18n.getMessage("add_new_tab_in_window");
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
  get themeColorSettingHeader() {
    return chrome.i18n.getMessage("theme_color_setting_header");
  }
  get mode() {
    return chrome.i18n.getMessage("mode");
  }
  get light() {
    return chrome.i18n.getMessage("light");
  }
  get dark() {
    return chrome.i18n.getMessage("dark");
  }
  get system() {
    return chrome.i18n.getMessage("system");
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
  get toolbarSettingHeader() {
    return chrome.i18n.getMessage("toolbar_setting_header");
  }
  get toolbarIconClickBehaviorSettingHeader() {
    return chrome.i18n.getMessage("toolbar_icon_click_behavior_setting_header");
  }
  get toolbarIconClickBehaviorSelectPopup() {
    return chrome.i18n.getMessage("toolbar_icon_click_behavior_select_popup");
  }
  get toolbarIconClickBehaviorSelectSidePanel() {
    return chrome.i18n.getMessage(
      "toolbar_icon_click_behavior_select_side_panel",
    );
  }
  get toolbarIconClickBehaviorSelectDashboard() {
    return chrome.i18n.getMessage(
      "toolbar_icon_click_behavior_select_dashboard",
    );
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
  get optionsNavigationSaveAndRestore() {
    return chrome.i18n.getMessage("options_navigation_save_and_restore");
  }
  get optionsNavigationTidyTabs() {
    return chrome.i18n.getMessage("options_navigation_tidy_tabs");
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

  // TidyTabPage
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
  get tabGroupingSortGroupsAlphabetically() {
    return chrome.i18n.getMessage("tab_grouping_sort_groups_alphabetically");
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

  // Common
  get addTab() {
    return chrome.i18n.getMessage("add_tab");
  }
  get editTitle() {
    return chrome.i18n.getMessage("edit_title");
  }
  get open() {
    return chrome.i18n.getMessage("open");
  }
  get remove() {
    return chrome.i18n.getMessage("remove");
  }
  get toSelect() {
    return chrome.i18n.getMessage("to_select");
  }
  get toNavigate() {
    return chrome.i18n.getMessage("to_navigate");
  }
  get toClose() {
    return chrome.i18n.getMessage("to_close");
  }
}

const t = new Translations();

export default t;
