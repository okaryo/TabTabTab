import { createContext } from "react";

export type Page = "home" | "search";

type PageContextType = {
  page: Page;
  setPage: React.Dispatch<React.SetStateAction<Page>>;
};

export const PageContext = createContext<PageContextType>({
  page: "home",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPage: () => {},
});
