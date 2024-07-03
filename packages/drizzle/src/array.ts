export function isNotNull<T>(v: T | null | undefined): v is T {
  return v != null;
}
export function arrayOrUndefined<T>(
  v: (undefined | T | null)[] | T | undefined | null,
): T[] | undefined {
  if (v == null) return;
  if (Array.isArray(v)) {
    const ret = v.filter(isNotNull);
    return ret.length ? ret : undefined;
  }
  return [v];
}
