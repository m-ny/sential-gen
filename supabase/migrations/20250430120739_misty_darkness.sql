/*
  # Update credit system for new pricing model

  1. Changes
    - Update handle_payment_success function to add 5 credits
    - Remove subscription handling since we only have one-time payments
*/

CREATE OR REPLACE FUNCTION handle_payment_success()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Handle one-time payment
  IF NEW.payment_status = 'paid' AND NEW.status = 'completed' THEN
    -- Get user_id from stripe_customers
    UPDATE profiles
    SET 
      credits = credits + 5,  -- 5 credits per purchase
      plan = 'paid',
      updated_at = NOW()
    FROM stripe_customers
    WHERE stripe_customers.customer_id = NEW.customer_id
    AND profiles.id = stripe_customers.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop subscription trigger since we don't use it anymore
DROP TRIGGER IF EXISTS on_subscription_update ON stripe_subscriptions;
DROP FUNCTION IF EXISTS handle_subscription_update;