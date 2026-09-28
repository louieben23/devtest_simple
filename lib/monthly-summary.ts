export type MonthTotals = {
  moneyInCents: number;
  moneyOutCents: number;
  profitCents: number;
};

export type MonthlySummaryResponse = {
  monthLabel: string;
  currentMonth: MonthTotals;
  previousMonth: MonthTotals;
};

export type Sentiment = "positive" | "negative" | "neutral";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const signedCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  signDisplay: "exceptZero",
});

export function formatCurrency(amountCents: number) {
  return currencyFormatter.format(amountCents / 100);
}

// "+$1,240.00", "-$300.00" or "$0.00".
export function formatSignedCurrency(amountCents: number) {
  return signedCurrencyFormatter.format(amountCents / 100);
}

// Compares this month with last month. For money out, going down is the good direction.
export function getTrendSentiment(
  currentAmountCents: number,
  previousAmountCents: number,
  isHigherBetter: boolean,
): Sentiment {
  if (currentAmountCents === previousAmountCents) return "neutral";
  const isHigher = currentAmountCents > previousAmountCents;
  return isHigher === isHigherBetter ? "positive" : "negative";
}

const wholeCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const signedWholeCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
});

// "$6,500" — for the big dashboard numbers where cents are noise.
export function formatWholeCurrency(amountCents: number) {
  return wholeCurrencyFormatter.format(amountCents / 100);
}

// "+$1,200", "-$300" or "$0".
export function formatSignedWholeCurrency(amountCents: number) {
  return signedWholeCurrencyFormatter.format(amountCents / 100);
}

// First day of the UTC calendar month, shifted by monthOffset (-1 = last month, 1 = next month).
export function getUtcMonthStart(date: Date, monthOffset: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + monthOffset, 1));
}

// "2026-09-01"
export function toISODateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

// "September 2026"
export function formatMonthLabel(monthStart: Date) {
  return monthStart.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
