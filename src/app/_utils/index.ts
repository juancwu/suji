export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number, noSign = false) {
  let numStr = Math.abs(value).toFixed(2);
  const parts = numStr.split(".");
  parts[0] = parts[0]!.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  numStr = parts.join(".");

  const sign = !noSign ? (value < 0 ? "-" : value > 0 ? "+" : "") : "";

  return `${sign}\$${numStr}`;
}
