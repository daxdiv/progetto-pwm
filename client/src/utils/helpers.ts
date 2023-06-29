export function delay(ms = 750) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatDate(date: Date) {
  const locale = navigator.language;
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  return formatter.format(date);
}

export function truncate(str: string, maxLen: number) {
  return str.length > maxLen ? `${str.slice(0, maxLen - 1)}...` : str;
}
