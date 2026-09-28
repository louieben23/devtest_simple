import { createClient } from "@/lib/supabase/server";
import {
  formatMonthLabel,
  getUtcMonthStart,
  toISODateString,
  type MonthTotals,
  type MonthlySummaryResponse,
} from "@/lib/monthly-summary";

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
    .rpc("get_monthly_totals", { month_start: toISODateString(monthStart) })
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
  const currentMonthStart = getUtcMonthStart(today, 0);
  const previousMonthStart = getUtcMonthStart(today, -1);

  try {
    const [currentMonth, previousMonth] = await Promise.all([
      getMonthTotals(supabase, currentMonthStart),
      getMonthTotals(supabase, previousMonthStart),
    ]);

    const monthlySummary: MonthlySummaryResponse = {
      monthLabel: formatMonthLabel(currentMonthStart),
      currentMonth,
      previousMonth,
    };

    return Response.json(monthlySummary);
  } catch {
    return Response.json({ error: "Couldn't load this month's totals." }, { status: 500 });
  }
}
