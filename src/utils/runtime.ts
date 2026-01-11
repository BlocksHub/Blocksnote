export function isExecutedWithBun() {
  return typeof Bun !== "undefined";
}