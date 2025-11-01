-- Migration: add user_id to coin_transactions so we can track coins earned by users

ALTER TABLE coin_transactions
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES profiles(id) ON DELETE SET NULL;

-- Ensure RLS is enabled (table already had RLS in earlier migration)
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: users can view their own transactions
CREATE POLICY IF NOT EXISTS "Users can view their own coin transactions"
  ON coin_transactions FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR auth.uid() = user_id OR hostel_id IN (SELECT id FROM hostels WHERE manager_id = auth.uid()));

-- Policy: users can insert transactions for their own user_id
CREATE POLICY IF NOT EXISTS "Users can insert own coin transactions"
  ON coin_transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id OR auth.uid() IN (SELECT manager_id FROM hostels WHERE id = hostels.id));

-- Policy: hostel managers can view transactions for their hostel (already there but reinforce)
CREATE POLICY IF NOT EXISTS "Hostel managers can view own transactions"
  ON coin_transactions FOR SELECT
  TO authenticated
  USING (hostel_id IN (SELECT id FROM hostels WHERE manager_id = auth.uid()));

-- Note: backend logic must set user_id when awarding coins to users (this migration only enables tracking).
