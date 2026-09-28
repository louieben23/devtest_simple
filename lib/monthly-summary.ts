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

export function getProfitSentiment(profitCents: number): Sentiment {
  if (profitCents > 0) return "positive";
  if (profitCents < 0) return "negative";
  return "neutral";
}
