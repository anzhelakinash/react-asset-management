import { Observable } from "rxjs";
import { TkAPIBase, QueryParam } from "./TkAPIBase";
import APIUserDataDTO from "./model/APIUserDataDTO";

class TkAPIUser extends TkAPIBase {
  constructor(urlBase: string, pathPrefix?: string) {
    super(urlBase, pathPrefix ?? "/api/users/v1");
  }

  getUserData(): Observable<APIUserDataDTO> {
    return this.sendGETRequest({ path: "/user/data" });
  }

  userHasScopes(scopes: string[]): Observable<unknown> {
    const queryParams: QueryParam[] = scopes.map((scope) => {
      return {
        key: "scope",
        value: scope,
      };
    });

    return this.sendGETRequest({
      path: "/user/scope",
      queryParams: queryParams,
    });
  }
}

export { TkAPIUser };
