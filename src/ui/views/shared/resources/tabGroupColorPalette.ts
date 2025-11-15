import type { Palette } from "@mui/material/styles";
import type { Mode } from "../../../../model/Theme";

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
            grey: "#5f6367",
            blue: "#1b73e8",
            red: "#d93025",
            yellow: "#faab00",
            green: "#178038",
            pink: "#d01884",
            purple: "#9334e6",
            cyan: "#027b83",
            orange: "#fa903e",
          }
        : {
            grey: "#dadce0",
            blue: "#8ab4f7",
            red: "#f28b82",
            yellow: "#fdd663",
            green: "#81c995",
            pink: "#ff8bcb",
            purple: "#c589f9",
            cyan: "#78d9ec",
            orange: "#fcad70",
          },
  };
};
