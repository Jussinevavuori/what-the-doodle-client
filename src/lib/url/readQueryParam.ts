export function readQueryParam(param: string) {
  let query = window.location.search;
  query = query.replace("?", "");

  return query
    .split("&")
    .map((_) => _.split("="))
    .find((q) => q[0] === param)?.[1];
}
