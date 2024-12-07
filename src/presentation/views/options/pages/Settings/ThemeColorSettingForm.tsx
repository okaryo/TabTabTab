import Stack from "@mui/material/Stack";
import { useContext } from "react";
import { updateThemeColor } from "../../../../../data/repository/ThemeRepository";
import t from "../../../../../i18n/Translations";
import { themeColors } from "../../../../../model/Theme";
import { ThemeColorContext } from "../../../../contexts/ThemeColorContext";
import PaperWithHeader from "../../../shared/components/PaperWithHeader";
import TabGroupColorRadio from "../../../shared/components/TabGroupColorRadio";

const ThemeColorSetting = () => {
  const { themeColor } = useContext(ThemeColorContext);
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
            }}
          />
        ))}
      </Stack>
    </PaperWithHeader>
  );
};

export default ThemeColorSetting;
