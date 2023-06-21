import { useCallback, useContext } from "react";

import { Page, PageContext } from "../contexts/Page";

export const useNavigatePage = (): ((page: Page) => void) => {
  const { setPage } = useContext(PageContext);

  const naviatePage = useCallback((page: Page) => setPage(page), [setPage]);

  return naviatePage;
};
