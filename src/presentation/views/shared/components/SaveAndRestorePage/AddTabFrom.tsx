import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { forwardRef, useCallback, useEffect, useState } from "react";
import t from "../../../../../i18n/Translations";
import useDebounce from "../../../../hooks/useDebounce";
import TabFavicon from "../TabFavicon";

type AddTabFormProps = {
  onComplete: (data: {
    url: string;
    title: string;
    favIconUrl: string | null;
  }) => void;
  onCancel: () => void;
};

const AddTabForm = forwardRef<HTMLDivElement, AddTabFormProps>((props, ref) => {
  const { onComplete, onCancel } = props;

  const [url, setUrl] = useState("");
  const debouncedUrl = useDebounce(url, 1000);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [favIconUrl, setFavIconUrl] = useState(null);
  const [isTitleEditable, setIsTitleEditable] = useState(false);
  const [fetchSiteError, setFetchSiteError] = useState(false);
  const canAdd =
    !loading &&
    title !== "" &&
    url &&
    URL.canParse(urlWithScheme(url)) &&
    (!favIconUrl || (favIconUrl && URL.canParse(urlWithScheme(favIconUrl))));

  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setFetchSiteError(null);
  };
  const onChangeUrl = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };
  const fetchSiteTitleAndFavicon = useCallback(async (url: string) => {
    const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(response.statusText);

    const html = await response.text();
    const domParser = new DOMParser();
    const dom = domParser.parseFromString(html, "text/html");
    const faviconElement = dom.querySelector(
      'link[rel="icon"], link[rel="shortcut icon"]',
    ) as HTMLLinkElement;

    setTitle(dom.title);
    if (faviconElement) {
      const faviconHref = faviconElement.getAttribute("href");
      const faviconUrl = faviconHref.startsWith("/")
        ? new URL(faviconHref, url).href
        : faviconHref;
      setFavIconUrl(faviconUrl);
    } else {
      setFavIconUrl(null);
    }
  }, []);
  const onClickAddButton = () => {
    onComplete({
      title,
      url: urlWithScheme(url),
      favIconUrl: favIconUrl !== null ? urlWithScheme(favIconUrl) : null,
    });
  };

  useEffect(() => {
    const normalizedUrl = urlWithScheme(debouncedUrl);
    if (!URL.canParse(normalizedUrl)) return;

    setLoading(true);
    fetchSiteTitleAndFavicon(normalizedUrl)
      .then(() => {
        setFetchSiteError(null);
      })
      .catch((error) => {
        console.error("Failed to fetch metadata:", error);
        setFavIconUrl(null);
        setFetchSiteError(true);
      })
      .finally(() => {
        setLoading(false);
        setIsTitleEditable(true);
      });
  }, [debouncedUrl, fetchSiteTitleAndFavicon]);

  return (
    <Stack
      ref={ref}
      sx={{ p: 0.5 }}
      spacing={0.5}
      direction="row"
      alignItems="center"
    >
      <Stack sx={{ flexGrow: 1 }} spacing={0.5}>
        <TextField
          variant="outlined"
          size="small"
          value={title}
          placeholder={t.newTabTitleFormPlaceholderToStored}
          error={fetchSiteError}
          helperText={fetchSiteError ? t.newTabFormSiteFetchError : null}
          disabled={!isTitleEditable}
          slotProps={{
            input: {
              startAdornment: loading ? (
                <CircularProgress size={16} />
              ) : (
                <TabFavicon
                  url={URL.canParse(favIconUrl) ? new URL(favIconUrl) : null}
                  size={16}
                  style={{ marginRight: "12px" }}
                />
              ),
            },
          }}
          onChange={onChangeTitle}
        />
        <TextField
          placeholder={t.url}
          variant="outlined"
          size="small"
          autoFocus
          value={url}
          onChange={onChangeUrl}
        />
      </Stack>

      <Stack spacing={0.5}>
        <Button
          sx={{ textTransform: "none" }}
          variant="outlined"
          size="small"
          onClick={onCancel}
        >
          {t.cancel}
        </Button>
        <Button
          sx={{ textTransform: "none" }}
          variant="contained"
          size="small"
          onClick={onClickAddButton}
          disabled={!canAdd}
        >
          {t.add}
        </Button>
      </Stack>
    </Stack>
  );
});

const urlWithScheme = (url: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

export default AddTabForm;
