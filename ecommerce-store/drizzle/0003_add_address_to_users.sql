-- Add address column to users table if it doesn't exist
ALTER TABLE "users" ADD COLUMN IF EXISTS "address" text;
