/*
  # Add user trigger function and profile table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `name` (text)
      - `lastname` (text)
      - `role` (text)
      - `lastlogin` (timestamp)
      - `lastnotification` (timestamp)
      - `tos` (boolean)
      - `paiduntil` (timestamp)
      - `plan` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Functions
    - `handle_new_user`: Trigger function to create profile on user signup
    - `handle_auth_user_created`: Trigger to execute handle_new_user

  3. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users to read/update their own profile
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  name text,
  lastname text,
  role text DEFAULT 'user',
  lastlogin timestamp with time zone,
  lastnotification timestamp with time zone,
  tos boolean DEFAULT false,
  paiduntil timestamp with time zone,
  plan text DEFAULT 'free',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, lastname, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastname', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();