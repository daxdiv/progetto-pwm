import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Funzione che restituisce una stringa con le classi tailwind passate come argomento, utile perche cosi elimino
 * duplicati e classi che si sovrappongono tra loro
 * @param args classi tailwind
 * @returns stringa con le classi tailwind
 * @see https://www.npmjs.com/package/tailwind-merge
 * @see https://www.npmjs.com/package/clsx
 */
export function cn(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}
