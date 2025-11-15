import CircleIcon from "@mui/icons-material/Circle";
import Radio from "@mui/material/Radio";
import { useTheme } from "@mui/material/styles";
import type { TabGroupColor } from "../../model/TabContainer";

type TabGroupColorRadioProps = {
  color: TabGroupColor;
  checked: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const TabGroupColorRadio = (props: TabGroupColorRadioProps) => {
  const { color, checked, onClick } = props;
  const theme = useTheme();

  return (
    <Radio
      sx={{
        p: 0,
        color: theme.palette.tabGroup[color],
        "&.Mui-checked": {
          color: theme.palette.tabGroup[color],
        },
      }}
      checked={checked}
      icon={<CircleIcon sx={{ color: theme.palette.tabGroup[color] }} />}
      onClick={onClick}
    />
  );
};

export default TabGroupColorRadio;
