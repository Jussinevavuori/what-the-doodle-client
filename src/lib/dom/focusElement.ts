type Options =
  | {
      id: string;
      query?: never;
    }
  | {
      id?: never;
      query: string;
    };

export function focusElement(ops: Options) {
  const query = ops.query ?? `#${ops.id}`;
  const el = document.querySelector(query) as HTMLElement | null;
  console.log({ el });
  if (el && "focus" in el && typeof el["focus"] === "function") {
    el.focus();
  }
}
