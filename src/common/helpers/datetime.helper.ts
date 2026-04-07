export function getYear() {
  const now = new Date();
  const dateParts: any = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const year = dateParts.find((p: any) => p.type === 'year').value;
  return year;
}
