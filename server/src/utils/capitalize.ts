/**
 * Restituisce la stringa con la prima lettera maiuscola
 * @param str stringa da modificare
 * @returns stringa modificata (es. "ciao" -> "Ciao")
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default capitalize;
