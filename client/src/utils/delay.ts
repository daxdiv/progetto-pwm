export function delay(ms = 750) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
