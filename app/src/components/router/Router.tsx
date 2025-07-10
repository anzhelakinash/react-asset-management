import { RouterProvider } from "react-router-dom";
import { useContext } from "react";
import { SplashScreen } from "@tk/tk-common-components";
import { AuthContext } from "../../api/auth/TkAuthService";

import routes from "../../config/routes";
import Error403 from "../../views/pages/error/Error403";

function Router() {
  const authContext = useContext(AuthContext);

  if (!authContext.user) {
    return <SplashScreen />;
  }

  if (!authContext.user.authenticated) {
    return <Error403 />;
  }

  return <RouterProvider router={routes} fallbackElement={<SplashScreen />} />;
}

export default Router;
