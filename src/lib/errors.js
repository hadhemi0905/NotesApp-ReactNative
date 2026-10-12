/**
 * Transforme n'importe quelle erreur en message lisible pour l'UI.
 * @param {unknown} error
 * @returns {string}
 */
export function errorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong';
}