import { RouterProvider } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../api/auth/TkAuthService";

import routes from "../../config/routes";
import Error403 from "../../views/pages/error/Error403";

function Router() {
  const authContext = useContext(AuthContext);

  if (!authContext.user) {
    return <>Loading...</>;
  }

  if (!authContext.user.authenticated) {
    return <Error403 />;
  }

  return <RouterProvider router={routes} />;
}

export default Router;
