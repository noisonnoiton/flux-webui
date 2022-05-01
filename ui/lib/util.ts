import _ from "lodash";
import qs from "query-string";
import { toast } from "react-toastify";
import { DefaultClusters } from "./rpc/clusters";

export const wrappedFetch = (url, opts: RequestInit = {}) => {
  return fetch(url, {
    ...opts,
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
      ...(opts.headers || {}),
    },
  });
};

export const normalizePath = (pathname) => {
  return _.tail(pathname.split("/"));
};

export const prefixRoute = (route: string, ...idParams: string[]) =>
  `/:context/:namespace/${route}${
    idParams ? _.map(idParams, (p) => "/:" + p).join("") : ""
  }`;

export const toRoute = (route: PageRoute, params: string[]) => {
  const path = `/${_.map(params, (p) => `${p}/`).join("")}`;

  if (route === PageRoute.Home) {
    return route;
  }

  return `/${route}${params ? path : ""}`;
};

export const formatURL = (
  page: string,
  context: string,
  namespace: string,
  query: any = {}
) => {
  return `${page}?${qs.stringify({ context, namespace, ...query })}`;
};

export enum PageRoute {
  Redirector = "/",
  Home = "/sources",
  Sources = "/sources",
  SourceDetail = "/sources_detail",
  Kustomizations = "/kustomizations",
  KustomizationDetail = "/kustomizations_detail",
  HelmReleases = "/helmreleases",
  HelmReleaseDetail = "/helmreleases_detail",
  Events = "/events",
  Error = "/error",
}

export const getNavValue = (currentPage: any): PageRoute | boolean => {
  switch (currentPage) {
    case "kustomizations":
    case "kustomizations_detail":
      return PageRoute.Kustomizations;
    case "sources":
    case "sources_detail":
      return PageRoute.Sources;

    case "helmreleases":
    case "helmreleases_detail":
      return PageRoute.HelmReleases;

    case "events":
      return PageRoute.Events;

    default:
      return false;
  }
};

export const clustersClient = new DefaultClusters(
  "/api/clusters",
  wrappedFetch
);

export function notifySuccess(message: string) {
  toast["success"](message);
}

export function notifyError(message: string) {
  toast["error"](`Error: ${message}`);
}
