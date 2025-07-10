import { Observable } from "rxjs";
import { AjaxResponse, ajax } from "rxjs/ajax";

abstract class TkAPIBase {
  urlBase: string;
  pathPrefix: string;

  constructor(urlBase: string, pathPrefix: string) {
    this.urlBase = urlBase;
    this.pathPrefix = pathPrefix;
  }

  protected sendGETRequest<T>(options: GETOptions): Observable<T> {
    const url = this.buildRequestURL({ url: this.apiURL, path: options.path });

    return ajax.getJSON(url, options.headers);
  }

  protected sendPOSTRequest<T>(
    options: POSTOptions,
  ): Observable<AjaxResponse<T>> {
    const url = this.buildRequestURL({ url: this.apiURL, path: options.path });

    return ajax.post<T>(url, options.body, options.headers);
  }

  private buildRequestURL(options: URLBuildOptions): string {
    let url = this.combineURLAndPath(options.url, options.path);

    if (options.queryParams) {
      url = this.appendQueryString(options.url, options.queryParams);
    }

    return url;
  }

  private appendQueryString(url: string, queryParams: QueryParam[]): string {
    const queryString = this.generateQueryString(queryParams);
    return url + queryString;
  }

  private combineURLAndPath(url: string, path: string): string {
    if (url.endsWith("/")) {
      url = this.removeSlashFromEnd(url);
    }

    if (!path.startsWith("/")) {
      path = this.prependSlash(path);
    }

    return url + path;
  }

  private removeSlashFromEnd(url: string): string {
    return url.substring(0, url.length - 1);
  }

  private prependSlash(path: string): string {
    return "/" + path;
  }

  private generateQueryString(queryParams: QueryParam[]) {
    const queryArray = queryParams.map((param) => {
      return `${param.key}=${param.value}`;
    });

    return "?" + queryArray.join("&");
  }

  get apiURL(): string {
    return this.combineURLAndPath(this.urlBase, this.pathPrefix);
  }
}

interface POSTOptions {
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
}

interface GETOptions {
  path: string;
  headers?: Record<string, string>;
  queryParams?: QueryParam[];
}

interface URLBuildOptions {
  url: string;
  path: string;
  queryParams?: QueryParam[];
}

interface QueryParam {
  key: string;
  value: string;
}

export {
  TkAPIBase,
  type POSTOptions,
  type GETOptions,
  type URLBuildOptions,
  type QueryParam,
};
