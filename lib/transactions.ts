export type TransactionType = "income" | "expense";

export type TransactionItem = {
  id: string;
  type: TransactionType;
  amountCents: number;
  description: string;
  occurredOn: string;
};

export type TransactionsResponse = {
  monthStart: string;
  daysInMonth: number;
  transactions: TransactionItem[];
};

export type ExpenseGroup = {
  description: string;
  amountCents: number;
};

// "2026-09-01" → "Sep 1"
export function formatShortDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

// "2026-09-01" and day index 4 → "Sep 5"
export function formatDayOfMonth(monthStart: string, dayIndex: number) {
  const dayOfMonth = String(dayIndex + 1).padStart(2, "0");
  return formatShortDate(`${monthStart.slice(0, 8)}${dayOfMonth}`);
}

// One total per day of the month; index 0 is the 1st.
export function getDailyTotalsCents(
  transactions: TransactionItem[],
  transactionType: TransactionType,
  daysInMonth: number,
) {
  const dailyTotalsCents = Array<number>(daysInMonth).fill(0);

  for (const transaction of transactions) {
    if (transaction.type !== transactionType) continue;
    const dayIndex = Number(transaction.occurredOn.slice(8, 10)) - 1;
    dailyTotalsCents[dayIndex] += transaction.amountCents;
  }

  return dailyTotalsCents;
}

// Expenses summed by description, biggest first.
export function getTopExpenses(transactions: TransactionItem[], limit: number): ExpenseGroup[] {
  const totalsByDescription = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== "expense") continue;
    const currentTotalCents = totalsByDescription.get(transaction.description) ?? 0;
    totalsByDescription.set(transaction.description, currentTotalCents + transaction.amountCents);
  }

  return Array.from(totalsByDescription, ([description, amountCents]) => ({ description, amountCents }))
    .sort((first, second) => second.amountCents - first.amountCents)
    .slice(0, limit);
}
