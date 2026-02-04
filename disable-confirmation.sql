-- Disable email confirmation for testing
-- Run this in Supabase SQL Editor to allow instant signups

update auth.users set email_confirmed_at = now() where email_confirmed_at is null;

-- Or update the config to not require confirmation:
-- Go to Authentication → Providers → Email → disable "Confirm email"
