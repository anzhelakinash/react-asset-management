import { ReactNode, useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  redirectOnNoAccess: string;
  allowedScopes?: string[];
}

function PrivateRoute(props: Props): ReactNode {
  const authContext = useContext(AuthContext);

  function isAuthorized(): boolean {
    return authContext.user !== undefined;
  }

  return isAuthorized() ? (
    <Outlet />
  ) : (
    <Navigate to={props.redirectOnNoAccess} />
  );
}

export default PrivateRoute;
