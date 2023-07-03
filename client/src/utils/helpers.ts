/**
 * Simula un ritardo di ms millisecondi, a scopo di mostrare il caricamento in modo più fluido
 * @param ms millisecondi da aspettare
 * @returns una promise che si risolve dopo ms millisecondi
 */
export function delay(ms = 750) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Restituisce la data formattata in base alla lingua del browser
 * @param date data da formattare
 * @returns data formattata
 */
export function formatDate(date: Date) {
  const locale = navigator.language;
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  return formatter.format(date);
}

/**
 * Tronca la stringa se supera la lunghezza massima
 * @param str stringa da troncare
 * @param maxLen lunghezza massima
 * @returns stringa troncata
 * @example truncate("ciao", 3) -> "cia..."
 */
export function truncate(str: string, maxLen: number) {
  return str.length > maxLen ? `${str.slice(0, maxLen - 1)}...` : str;
}

/**
 * Formatta la durata in millisecondi in ore, minuti e secondi
 * @param ms durata in millisecondi
 * @returns durata formattata
 * @example formatDuration(1000) -> "0:01"
 * @example formatDuration(60000) -> "1:00"
 * @example formatDuration(3600000) -> "1:00:00"
 */
export function formatDuration(ms: number) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);

  return `${hours ? `${hours}:` : ""}${minutes}:${+seconds < 10 ? "0" : ""}${seconds}`;
}
