import Stack from "@mui/material/Stack";
import { useContext } from "react";
import { themeColors } from "../../../../../model/Theme";
import { updateThemeColor } from "../../../../../repository/ThemeRepository";
import PaperWithHeader from "../../../../components/PaperWithHeader";
import TabGroupColorRadio from "../../../../components/TabGroupColorRadio";
import { ThemeColorContext } from "../../../../contexts/ThemeColorContext";

const ThemeColorSetting = () => {
  const { themeColor, setThemeColor } = useContext(ThemeColorContext);
  return (
    <PaperWithHeader header={"ThemeColor"}>
      <Stack
        spacing={1}
        direction="row"
        sx={{
          p: 2,
        }}
      >
        {themeColors.map((color) => (
          <TabGroupColorRadio
            key={color}
            color={color}
            checked={color === themeColor}
            onClick={() => {
              updateThemeColor(color);
              setThemeColor(color);
            }}
          />
        ))}
      </Stack>
    </PaperWithHeader>
  );
};

export default ThemeColorSetting;
