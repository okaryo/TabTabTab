import {
  blue,
  cyan,
  green,
  grey,
  orange,
  pink,
  purple,
  red,
  yellow,
} from "@mui/material/colors";
import { PaletteColorOptions } from "@mui/material/styles";
import { Mode, ThemeColor } from "../../model/Theme";

export const themeColorPaletteBy = (
  themeColor: ThemeColor,
  mode: Mode,
): PaletteColorOptions => {
  if (mode === "light") {
    switch (themeColor) {
      case "grey":
        return {
          main: grey[700],
          light: grey[400],
          dark: grey[800],
        };
      case "blue":
        return {
          main: blue[700],
          light: blue[400],
          dark: blue[800],
        };
      case "red":
        return {
          main: red[700],
          light: red[400],
          dark: red[800],
        };
      case "yellow":
        return {
          main: yellow[700],
          light: yellow[400],
          dark: yellow[800],
        };
      case "green":
        return {
          main: green[700],
          light: green[400],
          dark: green[800],
        };
      case "pink":
        return {
          main: pink[700],
          light: pink[400],
          dark: pink[800],
        };
      case "purple":
        return {
          main: purple[700],
          light: purple[400],
          dark: purple[800],
        };
      case "cyan":
        return {
          main: cyan[700],
          light: cyan[400],
          dark: cyan[800],
        };
      case "orange":
        return {
          main: orange[700],
          light: orange[400],
          dark: orange[800],
        };
    }
  }

  switch (themeColor) {
    case "grey":
      return {
        main: grey[200],
        light: grey[50],
        dark: grey[400],
      };
    case "blue":
      return {
        main: blue[200],
        light: blue[50],
        dark: blue[400],
      };
    case "red":
      return {
        main: red[200],
        light: red[50],
        dark: red[400],
      };
    case "yellow":
      return {
        main: yellow[200],
        light: yellow[50],
        dark: yellow[400],
      };
    case "green":
      return {
        main: green[200],
        light: green[50],
        dark: green[400],
      };
    case "pink":
      return {
        main: pink[200],
        light: pink[50],
        dark: pink[400],
      };
    case "purple":
      return {
        main: purple[200],
        light: purple[50],
        dark: purple[400],
      };
    case "cyan":
      return {
        main: cyan[200],
        light: cyan[50],
        dark: cyan[400],
      };
    case "orange":
      return {
        main: orange[200],
        light: orange[50],
        dark: orange[400],
      };
  }
};
