/*
  # Create Eco-Stay Connect Initial Schema

  ## Overview
  This migration creates the complete database schema for the Eco-Stay Connect platform,
  a sustainable hostels network connecting eco-friendly accommodations across the Arab world.

  ## New Tables

  ### `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `role` (text) - 'traveler' or 'hostel_manager'
  - `phone` (text, optional)
  - `country` (text, optional)
  - `bio` (text, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `hostels`
  - `id` (uuid, primary key)
  - `manager_id` (uuid, references profiles)
  - `name` (text)
  - `location` (text)
  - `description` (text)
  - `country` (text)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `eco_score` (integer, default 0)
  - `travel_score` (numeric, default 0)
  - `education_score` (numeric, default 0)
  - `rating` (numeric, default 0)
  - `image_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `hostel_activities`
  - `id` (uuid, primary key)
  - `hostel_id` (uuid, references hostels)
  - `type` (text) - energy, water, waste, community, education, biodiversity
  - `title` (text)
  - `description` (text)
  - `activity_date` (date)
  - `points` (integer)
  - `coins` (integer)
  - `evidence_url` (text, optional)
  - `status` (text) - pending, verified, rejected
  - `created_at` (timestamptz)

  ### `badges`
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `icon` (text)
  - `created_at` (timestamptz)

  ### `hostel_badges`
  - `id` (uuid, primary key)
  - `hostel_id` (uuid, references hostels)
  - `badge_id` (uuid, references badges)
  - `earned_at` (timestamptz)

  ### `wishes`
  - `id` (uuid, primary key)
  - `traveler_id` (uuid, references profiles)
  - `title` (text)
  - `description` (text)
  - `country` (text, optional)
  - `votes` (integer, default 1)
  - `status` (text) - open, adopted, completed
  - `adopted_by_hostel_id` (uuid, optional, references hostels)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `coin_transactions`
  - `id` (uuid, primary key)
  - `hostel_id` (uuid, references hostels)
  - `activity_id` (uuid, optional, references hostel_activities)
  - `coins` (integer)
  - `description` (text)
  - `created_at` (timestamptz)

  ### `favorites`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `hostel_id` (uuid, references hostels)
  - `created_at` (timestamptz)
  - Unique constraint on (user_id, hostel_id)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
  - Hostel managers can only edit their own hostels
  - Public read access for hostels and wishes
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'traveler' CHECK (role IN ('traveler', 'hostel_manager')),
  phone text,
  country text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create hostels table
CREATE TABLE IF NOT EXISTS hostels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  country text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  eco_score integer DEFAULT 0,
  travel_score numeric DEFAULT 0,
  education_score numeric DEFAULT 0,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hostels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hostels"
  ON hostels FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Hostel managers can insert hostels"
  ON hostels FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = manager_id);

CREATE POLICY "Hostel managers can update own hostels"
  ON hostels FOR UPDATE
  TO authenticated
  USING (auth.uid() = manager_id)
  WITH CHECK (auth.uid() = manager_id);

-- Create hostel_activities table
CREATE TABLE IF NOT EXISTS hostel_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id uuid NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('energy', 'water', 'waste', 'community', 'education', 'biodiversity')),
  title text NOT NULL,
  description text NOT NULL,
  activity_date date NOT NULL DEFAULT CURRENT_DATE,
  points integer NOT NULL DEFAULT 0,
  coins integer NOT NULL DEFAULT 0,
  evidence_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hostel_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view verified activities"
  ON hostel_activities FOR SELECT
  TO authenticated
  USING (status = 'verified');

CREATE POLICY "Hostel managers can view own activities"
  ON hostel_activities FOR SELECT
  TO authenticated
  USING (
    hostel_id IN (
      SELECT id FROM hostels WHERE manager_id = auth.uid()
    )
  );

CREATE POLICY "Hostel managers can insert activities"
  ON hostel_activities FOR INSERT
  TO authenticated
  WITH CHECK (
    hostel_id IN (
      SELECT id FROM hostels WHERE manager_id = auth.uid()
    )
  );

CREATE POLICY "Hostel managers can update own activities"
  ON hostel_activities FOR UPDATE
  TO authenticated
  USING (
    hostel_id IN (
      SELECT id FROM hostels WHERE manager_id = auth.uid()
    )
  )
  WITH CHECK (
    hostel_id IN (
      SELECT id FROM hostels WHERE manager_id = auth.uid()
    )
  );

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- Create hostel_badges table
CREATE TABLE IF NOT EXISTS hostel_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id uuid NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(hostel_id, badge_id)
);

ALTER TABLE hostel_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hostel badges"
  ON hostel_badges FOR SELECT
  TO authenticated
  USING (true);

-- Create wishes table
CREATE TABLE IF NOT EXISTS wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  country text,
  votes integer DEFAULT 1,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'adopted', 'completed')),
  adopted_by_hostel_id uuid REFERENCES hostels(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view wishes"
  ON wishes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create wishes"
  ON wishes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = traveler_id);

CREATE POLICY "Wish creators can update own wishes"
  ON wishes FOR UPDATE
  TO authenticated
  USING (auth.uid() = traveler_id)
  WITH CHECK (auth.uid() = traveler_id);

CREATE POLICY "Hostel managers can adopt wishes"
  ON wishes FOR UPDATE
  TO authenticated
  USING (
    adopted_by_hostel_id IN (
      SELECT id FROM hostels WHERE manager_id = auth.uid()
    ) OR adopted_by_hostel_id IS NULL
  )
  WITH CHECK (
    adopted_by_hostel_id IN (
      SELECT id FROM hostels WHERE manager_id = auth.uid()
    ) OR adopted_by_hostel_id IS NULL
  );

-- Create coin_transactions table
CREATE TABLE IF NOT EXISTS coin_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id uuid NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
  activity_id uuid REFERENCES hostel_activities(id) ON DELETE SET NULL,
  coins integer NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hostel managers can view own transactions"
  ON coin_transactions FOR SELECT
  TO authenticated
  USING (
    hostel_id IN (
      SELECT id FROM hostels WHERE manager_id = auth.uid()
    )
  );

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hostel_id uuid NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, hostel_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default badges
INSERT INTO badges (name, description, icon) VALUES
  ('Solar Champion', 'Installed solar energy system', 'fa-sun'),
  ('Waste Warrior', 'Reduced waste by 50%', 'fa-recycle'),
  ('Community Hero', 'Organized 5+ community events', 'fa-users'),
  ('Water Saver', 'Reduced water consumption by 30%', 'fa-tint'),
  ('Biodiversity Guardian', 'Protected local biodiversity', 'fa-leaf'),
  ('Zero Waste', 'Achieved zero waste operations', 'fa-trash-alt'),
  ('Upcycling Expert', 'Upcycled furniture and materials', 'fa-sync'),
  ('Cultural Preservation', 'Preserved cultural heritage', 'fa-landmark'),
  ('Wind Energy', 'Implemented wind power', 'fa-wind'),
  ('Urban Farming', 'Created rooftop garden', 'fa-seedling'),
  ('River Guardian', 'Protected local waterways', 'fa-water'),
  ('Tech Innovator', 'Implemented green technology', 'fa-lightbulb'),
  ('Water Recycling', 'Installed greywater system', 'fa-recycle'),
  ('Clean Transportation', 'Provide EV charging', 'fa-charging-station'),
  ('Cultural Ambassador', 'Promote local culture', 'fa-globe'),
  ('Desert Guardian', 'Desert conservation efforts', 'fa-sun'),
  ('Mountain Guardian', 'Mountain conservation efforts', 'fa-mountain')
ON CONFLICT (name) DO NOTHING;
