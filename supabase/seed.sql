-- New users get the sample transactions and jobs automatically when they sign up
-- (see supabase/migrations/20260928030000_seed_new_users.sql).
--
-- Run this in Supabase Dashboard → SQL Editor to give the sample data to users who signed up
-- before that migration, or to reset everyone's sample data. Every signed-up user gets fresh sample rows;
-- running it again replaces them instead of adding duplicates, and also removes the money in
-- added by marking sample jobs done.
--
-- The sample rows themselves live in public.reset_sample_data.

select public.reset_sample_data(users.id)
from auth.users as users;
