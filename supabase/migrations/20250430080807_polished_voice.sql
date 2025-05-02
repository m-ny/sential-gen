/*
  # Add credits to profiles table

  1. Changes
    - Add credits column to profiles table
    - Add default value of 0 for credits
    - Add check constraint to ensure credits are non-negative

  2. Security
    - No changes to existing RLS policies needed
*/

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS credits integer DEFAULT 0 CHECK (credits >= 0);