import { Palette } from "@mui/material/styles";
import { Mode } from "../../model/Theme";

declare module "@mui/material/styles" {
  interface Palette {
    tabGroup: {
      grey: string;
      blue: string;
      red: string;
      yellow: string;
      green: string;
      pink: string;
      purple: string;
      cyan: string;
      orange: string;
    };
  }

  interface PaletteOptions {
    tabGroup: {
      grey?: string;
      blue?: string;
      red?: string;
      yellow?: string;
      green?: string;
      pink?: string;
      purple?: string;
      cyan?: string;
      orange?: string;
    };
  }
}

export const tabGroupColorPalette = (mode: Mode): Pick<Palette, "tabGroup"> => {
  return {
    tabGroup:
      mode === "light"
        ? {
            grey: "#616161",
            blue: "#1a73e8",
            red: "#d93025",
            yellow: "#e37400",
            green: "#1e8e3e",
            pink: "#d01884",
            purple: "#9334e6",
            cyan: "#007b83",
            orange: "#fa903e",
          }
        : {
            grey: "#bdc1c6",
            blue: "#7baaf7",
            red: "#e67c73",
            yellow: "#f7cb4d",
            green: "#57bb8a",
            pink: "#ff8bcb",
            purple: "#d7aefb",
            cyan: "#78d9ec",
            orange: "#fcad70",
          },
  };
};
