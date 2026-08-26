const ZAR = new Intl.NumberFormat('en-ZA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Cents to a displayable rand amount, e.g. 12000 -> "R 120.00". */
export function formatRands(cents: number): string {
  return `R ${ZAR.format(cents / 100)}`;
}
