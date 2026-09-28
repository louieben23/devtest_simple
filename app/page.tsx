import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Example database read. RLS ensures this only returns the caller's own row.
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const name = profile?.full_name ?? user.email;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <main className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-black/[.08] bg-white p-8 text-center shadow-sm dark:border-white/[.145] dark:bg-zinc-950">
        {profile?.avatar_url && (
          <Image
            src={profile.avatar_url}
            alt=""
            width={64}
            height={64}
            className="rounded-full"
            unoptimized
          />
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Hi, {name}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {user.email}
          </p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="h-10 rounded-full border border-black/[.12] px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/[.2] dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Sign out
          </button>
        </form>
      </main>
    </div>
  );
}
