import { formatWholeCurrency } from "@/lib/monthly-summary";
import { getTopExpenses, type TransactionItem } from "@/lib/transactions";
import { CardBodySkeleton, CardPill, DashboardCard } from "@/components/dashboard/dashboard-card";

const TOP_EXPENSE_COUNT = 5;

export function TopSpendingCard({ transactions }: { transactions: TransactionItem[] | null }) {
  if (!transactions) {
    return (
      <DashboardCard id="top-spending" title="Top spending">
        <CardBodySkeleton />
      </DashboardCard>
    );
  }

  const topExpenses = getTopExpenses(transactions, TOP_EXPENSE_COUNT);
  const largestExpenseCents = topExpenses[0]?.amountCents ?? 0;
  const expenses = transactions.filter((transaction) => transaction.type === "expense");
  const totalExpenseCents = expenses.reduce((total, expense) => total + expense.amountCents, 0);
  const largestExpenseSharePercent =
    totalExpenseCents > 0 ? Math.round((largestExpenseCents / totalExpenseCents) * 100) : 0;

  return (
    <DashboardCard
      id="top-spending"
      title="Top spending"
      action={<CardPill>{expenses.length} payments</CardPill>}
    >
      {topExpenses.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No spending this month yet.</p>
      ) : (
        <>
          <p className="text-5xl font-light tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
            {largestExpenseSharePercent}%
          </p>
          <p className="mt-2 truncate text-xs text-zinc-500 dark:text-zinc-400">
            of spending went to {topExpenses[0].description}
          </p>

          <ul className="mt-auto flex flex-col gap-3 pt-6">
            {topExpenses.map((expense) => (
              <li
                key={expense.description}
                className="grid grid-cols-[minmax(0,6rem)_1fr_auto] items-center gap-3 text-xs"
              >
                <span className="truncate text-zinc-600 dark:text-zinc-400" title={expense.description}>
                  {expense.description}
                </span>
                <span className="h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <span
                    className="block h-full rounded-full bg-zinc-800 dark:bg-zinc-200"
                    style={{ width: `${(expense.amountCents / largestExpenseCents) * 100}%` }}
                  />
                </span>
                <span className="font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                  {formatWholeCurrency(expense.amountCents)}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </DashboardCard>
  );
}
