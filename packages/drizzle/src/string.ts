export function camelToSnake(str: string) {
  return str.replace(/([a-z0-9])([A-Z]{1,})/g, "$1_$2").toLowerCase();
}
export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}
