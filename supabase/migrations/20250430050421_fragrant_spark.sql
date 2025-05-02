/*
  # Create logos table and related schemas

  1. New Tables
    - `logos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `prompt` (text)
      - `style` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `company_name` (text)
      - `company_description` (text)

  2. Security
    - Enable RLS on `logos` table
    - Add policies for authenticated users to:
      - Read their own logos
      - Create new logos
*/

CREATE TABLE IF NOT EXISTS logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  prompt text NOT NULL,
  style text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  company_name text NOT NULL,
  company_description text NOT NULL
);

ALTER TABLE logos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own logos"
  ON logos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create logos"
  ON logos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);