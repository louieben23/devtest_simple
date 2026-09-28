import { createClient } from "@/lib/supabase/server";
import { getUtcMonthStart, toISODateString } from "@/lib/monthly-summary";
import type { TransactionItem, TransactionType, TransactionsResponse } from "@/lib/transactions";

type TransactionRow = {
  id: string;
  type: TransactionType;
  amount_cents: number;
  description: string | null;
  occurred_on: string;
};

// This month's transactions for the signed-in user, newest first.
// Months follow the UTC calendar, same as /api/monthly-summary.
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  const today = new Date();
  const currentMonthStart = getUtcMonthStart(today, 0);
  const nextMonthStart = getUtcMonthStart(today, 1);

  // RLS ensures this only returns the caller's own rows.
  const { data, error } = await supabase
    .from("transactions")
    .select("id, type, amount_cents, description, occurred_on")
    .gte("occurred_on", toISODateString(currentMonthStart))
    .lt("occurred_on", toISODateString(nextMonthStart))
    .order("occurred_on", { ascending: false })
    .order("created_at", { ascending: false })
    .overrideTypes<TransactionRow[], { merge: false }>();

  if (error) {
    return Response.json({ error: "Couldn't load this month's transactions." }, { status: 500 });
  }

  const transactions: TransactionItem[] = data.map((row) => ({
    id: row.id,
    type: row.type,
    amountCents: Number(row.amount_cents),
    description: row.description ?? "No description",
    occurredOn: row.occurred_on,
  }));

  // Day 0 of next month is the last day of this month.
  const daysInMonth = new Date(nextMonthStart.getTime() - 1).getUTCDate();

  const transactionsResponse: TransactionsResponse = {
    monthStart: toISODateString(currentMonthStart),
    daysInMonth,
    transactions,
  };
  return Response.json(transactionsResponse);
}
