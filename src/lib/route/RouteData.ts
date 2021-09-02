export class RouteData<T extends { [key: string]: string }> {
  /**
   * Path for the route.
   */
  readonly path: string;

  /**
   * User-readable displayed title for the route.
   */
  readonly title: string;

  /**
   * Names of variables in route data
   */
  readonly variables: Array<keyof T>;

  constructor(options: {
    path: string;
    title: string;
    variables: Array<keyof T>;
  }) {
    this.path = options.path;
    this.title = options.title;
    this.variables = options.variables;
  }

  createPath(
    values: T,
    opts: {
      query?: Record<string, string>;
      hash?: string;
    } = {}
  ) {
    // Replace all dynamic values in path
    let p = this.path;
    for (const key of Object.keys(values)) {
      p = p.replace(`:${key}`, values[key]);
    }

    // Add query
    if (opts.query) {
      p +=
        "?" +
        Object.entries(opts.query)
          .map((entry) => `${entry[0]}=${entry[1]}`)
          .join("&");
    }

    // Add hash
    if (opts.hash) {
      p += `#${opts.hash}`;
    }

    return p;
  }
}
