export const formatDate = (date: Date) => {
  const locale = navigator.language;
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  return formatter.format(date);
};
