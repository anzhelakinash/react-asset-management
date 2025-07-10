import { useEffect } from "react";
import config from "../config/config";

/**
 * Custom hook for setting the title of the page.
 */
function useTitle(pageTitle?: string) {
  useEffect(() => {
    document.title =
      pageTitle !== undefined
        ? `${config.siteTitle} - ${pageTitle}`
        : config.siteTitle;

    return () => {
      // reset to default title on onmount
      document.title = config.siteTitle;
    };
  });
}

export default useTitle;
