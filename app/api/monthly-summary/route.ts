import { createClient } from "@/lib/supabase/server";
import type { MonthTotals, MonthlySummaryResponse } from "@/lib/monthly-summary";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

type MonthlyTotalsRow = {
  money_in_cents: number;
  money_out_cents: number;
};

async function getMonthTotals(
  supabase: SupabaseClient,
  monthStart: Date,
): Promise<MonthTotals> {
  const { data, error } = await supabase
    .rpc("get_monthly_totals", { month_start: monthStart.toISOString().slice(0, 10) })
    .single<MonthlyTotalsRow>();

  if (error) throw error;

  const moneyInCents = Number(data.money_in_cents);
  const moneyOutCents = Number(data.money_out_cents);
  return { moneyInCents, moneyOutCents, profitCents: moneyInCents - moneyOutCents };
}

// This month's and last month's money in / money out / profit for the signed-in user.
// Months follow the UTC calendar.
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }

  const today = new Date();
  const currentMonthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  const previousMonthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));

  try {
    const [currentMonth, previousMonth] = await Promise.all([
      getMonthTotals(supabase, currentMonthStart),
      getMonthTotals(supabase, previousMonthStart),
    ]);

    const monthlySummary: MonthlySummaryResponse = {
      monthLabel: currentMonthStart.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
      currentMonth,
      previousMonth,
    };

    return Response.json(monthlySummary);
  } catch {
    return Response.json({ error: "Couldn't load this month's totals." }, { status: 500 });
  }
}
