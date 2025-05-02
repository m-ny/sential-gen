-- Function to handle successful payments
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
      credits = -1,  -- -1 indicates unlimited generations
      plan = 'unlimited',
      updated_at = NOW()
    FROM stripe_customers
    WHERE stripe_customers.customer_id = NEW.customer_id
    AND profiles.id = stripe_customers.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function to handle subscription updates
CREATE OR REPLACE FUNCTION handle_subscription_update()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only process active subscriptions
  IF NEW.status = 'active' THEN
    -- Get user_id from stripe_customers
    UPDATE profiles
    SET 
      credits = -1,  -- -1 indicates unlimited generations
      plan = 'unlimited',
      updated_at = NOW()
    FROM stripe_customers
    WHERE stripe_customers.customer_id = NEW.customer_id
    AND profiles.id = stripe_customers.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for payment success
DROP TRIGGER IF EXISTS on_payment_success ON stripe_orders;
CREATE TRIGGER on_payment_success
  AFTER INSERT OR UPDATE
  ON stripe_orders
  FOR EACH ROW
  EXECUTE FUNCTION handle_payment_success();

-- Create trigger for subscription updates
DROP TRIGGER IF EXISTS on_subscription_update ON stripe_subscriptions;
CREATE TRIGGER on_subscription_update
  AFTER INSERT OR UPDATE
  ON stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_subscription_update();