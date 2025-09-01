export function getFormattedUTCDateTime() {
  const date = new Date();

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  const second = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}+00:00`;
}
