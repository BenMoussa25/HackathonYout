-- Migration: add event comments, photos, ratings and forum tables

-- Event comments
CREATE TABLE IF NOT EXISTS event_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES hostel_activities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert comments"
  ON event_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view comments for activities"
  ON event_comments FOR SELECT
  TO authenticated
  USING (true);

-- Event photos
CREATE TABLE IF NOT EXISTS event_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES hostel_activities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE event_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert photos"
  ON event_photos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view photos for activities"
  ON event_photos FOR SELECT
  TO authenticated
  USING (true);

-- Event ratings
CREATE TABLE IF NOT EXISTS event_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES hostel_activities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(activity_id, user_id)
);

ALTER TABLE event_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can rate activities"
  ON event_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view ratings"
  ON event_ratings FOR SELECT
  TO authenticated
  USING (true);

-- Forum: threads and posts
CREATE TABLE IF NOT EXISTS forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  country text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can create threads"
  ON forum_threads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can view threads"
  ON forum_threads FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can post in threads"
  ON forum_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can view posts"
  ON forum_posts FOR SELECT
  TO authenticated
  USING (true);

-- Done
