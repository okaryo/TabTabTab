import PushPin from "@mui/icons-material/PushPin";
import Chip from "@mui/material/Chip";
import { GridSize } from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { useTheme } from "@mui/material/styles";

import t from "../../../i18n/Translations";
import { StoredTab } from "../../../model/Tab";
import {
  StoredTabContainer,
  isStoredTabGroup,
} from "../../../model/TabContainer";
import TabFavicon from "../TabFavicon";

type StoredGridTabContainerItemProps = {
  container: StoredTabContainer;
  xsSize: GridSize;
  mdSize: GridSize;
  dense: boolean;
};

export const StoredGridTabContainerItem = (
  props: StoredGridTabContainerItemProps,
) => {
  const { container, xsSize, mdSize, dense } = props;
  const theme = useTheme();
  const maxDisplayTabCount = 5;
  const isTabGroup = isStoredTabGroup(container);

  return (
    <Grid xs={xsSize} md={mdSize}>
      <Paper variant="outlined" sx={{ display: "flex", height: "100%" }}>
        <ListItem sx={{ gap: 2, py: dense ? 0.5 : 1, px: dense ? 1 : 2 }}>
          <ListItemText
            sx={{ my: 0.5 }}
            primary={
              <Stack direction="row" alignItems="center" spacing={1}>
                {container.type === "pinned" && (
                  <PushPin sx={{ fontSize: 16 }} />
                )}
                <Typography
                  variant="subtitle2"
                  component="p"
                  sx={{
                    px: isTabGroup ? 1 : 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  style={{
                    display: "inline-block",
                    borderRadius: "4px",
                    backgroundColor: isTabGroup
                      ? theme.palette.tabGroup[container.color]
                      : undefined,
                    color: isTabGroup
                      ? theme.palette.getContrastText(
                          theme.palette.tabGroup[container.color],
                        )
                      : undefined,
                  }}
                >
                  {isTabGroup ? container.name : t.pinned}
                </Typography>
                <Chip
                  label={container.children.length}
                  size="small"
                  color={container.type === "pinned" ? "primary" : undefined}
                  sx={{
                    height: 18,
                    backgroundColor: isTabGroup
                      ? theme.palette.tabGroup[container.color]
                      : undefined,
                    color: isTabGroup
                      ? theme.palette.getContrastText(
                          theme.palette.tabGroup[container.color],
                        )
                      : undefined,
                  }}
                />
              </Stack>
            }
            secondary={
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  mt: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {container.children
                  .slice(0, maxDisplayTabCount)
                  .map((child) => (
                    <TabFavicon
                      key={child.internalUid}
                      url={child.favIconUrl}
                      size={16}
                    />
                  ))}
                {container.children.length - maxDisplayTabCount > 0 && (
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{ lineHeight: 1 }}
                  >
                    {`+${container.children.length - maxDisplayTabCount}`}
                  </Typography>
                )}
              </Stack>
            }
            secondaryTypographyProps={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          />
        </ListItem>
      </Paper>
    </Grid>
  );
};

type StoredGridTabItemProps = {
  tab: StoredTab;
  xsSize: GridSize;
  mdSize: GridSize;
  dense: boolean;
};

export const StoredGridTabItem = (props: StoredGridTabItemProps) => {
  const { tab, xsSize, mdSize, dense } = props;

  return (
    <Grid xs={xsSize} md={mdSize}>
      <Paper variant="outlined" sx={{ display: "flex", height: "100%" }}>
        <ListItem sx={{ gap: 2, py: dense ? 0.5 : 1, px: dense ? 1 : 2 }}>
          <TabFavicon url={tab.favIconUrl} />
          <ListItemText
            sx={{ my: 0.5 }}
            primary={
              <Typography
                variant="subtitle2"
                component="p"
                title={tab.title}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.title}
              </Typography>
            }
            secondary={tab.url.host}
            secondaryTypographyProps={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          />
        </ListItem>
      </Paper>
    </Grid>
  );
};
