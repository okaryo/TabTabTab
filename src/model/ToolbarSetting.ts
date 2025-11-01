export type ToolbarSetting = {
  iconClickOpenView: "popup" | "sidePanel";
};

export const defaultToolbarSetting: ToolbarSetting = {
  iconClickOpenView: "popup",
};

export const isValidIconClickOpenView = (
  value: string,
): value is ToolbarSetting["iconClickOpenView"] => {
  return ["popup", "sidePanel"].includes(value);
};
