/*
  # Add credits column to profiles table

  1. Changes
    - Add `credits` column to `profiles` table with default value of 0
    - Add check constraint to ensure credits cannot be negative

  2. Notes
    - Uses IF NOT EXISTS to prevent errors if column already exists
    - Includes check constraint for data integrity
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'credits'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN credits integer DEFAULT 0;

    ALTER TABLE profiles 
    ADD CONSTRAINT profiles_credits_check 
    CHECK (credits >= 0);
  END IF;
END $$;