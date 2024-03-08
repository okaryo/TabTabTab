import Stack from "@mui/material/Stack";
import { useContext } from "react";
import { updateThemeColor } from "../../../../../data/repository/ThemeRepository";
import t from "../../../../../i18n/Translations";
import { themeColors } from "../../../../../model/Theme";
import PaperWithHeader from "../../../../components/PaperWithHeader";
import TabGroupColorRadio from "../../../../components/TabGroupColorRadio";
import { ThemeColorContext } from "../../../../contexts/ThemeColorContext";

const ThemeColorSetting = () => {
  const { themeColor, setThemeColor } = useContext(ThemeColorContext);
  return (
    <PaperWithHeader header={t.themeColorSettingHeader}>
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
