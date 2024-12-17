export type ToolbarSetting = {
  iconClickOpenView: "popup" | "sidePanel" | "dashboard";
};

export const defaultToolbarSetting: ToolbarSetting = {
  iconClickOpenView: "popup",
};

export const isValidIconClickOpenView = (
  value: string,
): value is ToolbarSetting["iconClickOpenView"] => {
  return ["popup", "sidePanel", "dashboard"].includes(value);
};
