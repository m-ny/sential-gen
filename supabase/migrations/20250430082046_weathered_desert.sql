-- Function to handle successful payments
CREATE OR REPLACE FUNCTION handle_payment_success()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Handle one-time payment (Starter plan)
  IF NEW.payment_status = 'paid' AND NEW.status = 'completed' THEN
    -- Get user_id from stripe_customers
    UPDATE profiles
    SET 
      credits = credits + 5,  -- Starter plan: 5 credits
      plan = 'starter',
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
      credits = CASE
        -- Creator plan: 30 credits monthly
        WHEN NEW.price_id = 'price_1RJU5YIP1R4GXsCdewpT2Llu' THEN 
          LEAST(credits + 30, 90)  -- Max 90 credits (rollover limit)
        -- Studio plan: Set to -1 for unlimited
        WHEN NEW.price_id = 'price_1RJU66IP1R4GXsCdwRyyhKUo' THEN 
          -1
        ELSE credits
      END,
      plan = CASE 
        WHEN NEW.price_id = 'price_1RJU5YIP1R4GXsCdewpT2Llu' THEN 'creator'
        WHEN NEW.price_id = 'price_1RJU66IP1R4GXsCdwRyyhKUo' THEN 'studio'
        ELSE plan
      END,
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