/*
# Create user progress tables for Digital Bharat (single-tenant, no auth)

1. New Tables
- `user_progress`: Tracks each user's exploration progress per state. Uses a device_id (generated client-side) as the user identifier since there is no auth flow.
  - `id` (uuid, primary key)
  - `device_id` (text, not null) - client-generated unique ID stored in localStorage
  - `state_id` (text, not null) - the state being explored
  - `explored_items` (jsonb, default '{}') - map of item types to counts {crafts: 3, textiles: 2, festivals: 1, ...}
  - `exploration_percentage` (integer, default 0) - percentage of state explored
  - `updated_at` (timestamptz, default now())
  - Unique constraint on (device_id, state_id)

- `quiz_results`: Records quiz attempt results.
  - `id` (uuid, primary key)
  - `device_id` (text, not null)
  - `category` (text, not null) - quiz category (e.g. "guess_state", "craft_origin")
  - `score` (integer, not null) - points earned
  - `total_questions` (integer, not null)
  - `correct_answers` (integer, not null)
  - `completed_at` (timestamptz, default now())

- `user_badges`: Tracks badges earned by users.
  - `id` (uuid, primary key)
  - `device_id` (text, not null)
  - `badge_id` (text, not null) - references badge definition in app code
  - `earned_at` (timestamptz, default now())
  - Unique constraint on (device_id, badge_id)

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated CRUD because the app has no sign-in screen; data is keyed by device_id.
- All policies use device_id for ownership checks.
*/

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  state_id text NOT NULL,
  explored_items jsonb NOT NULL DEFAULT '{}'::jsonb,
  exploration_percentage integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(device_id, state_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_user_progress" ON user_progress;
CREATE POLICY "anon_select_user_progress" ON user_progress FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_user_progress" ON user_progress;
CREATE POLICY "anon_insert_user_progress" ON user_progress FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_user_progress" ON user_progress;
CREATE POLICY "anon_update_user_progress" ON user_progress FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_user_progress" ON user_progress;
CREATE POLICY "anon_delete_user_progress" ON user_progress FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  category text NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_quiz_results" ON quiz_results;
CREATE POLICY "anon_select_quiz_results" ON quiz_results FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_quiz_results" ON quiz_results;
CREATE POLICY "anon_insert_quiz_results" ON quiz_results FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_quiz_results" ON quiz_results;
CREATE POLICY "anon_delete_quiz_results" ON quiz_results FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  badge_id text NOT NULL,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(device_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_user_badges" ON user_badges;
CREATE POLICY "anon_select_user_badges" ON user_badges FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_user_badges" ON user_badges;
CREATE POLICY "anon_insert_user_badges" ON user_badges FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_user_badges" ON user_badges;
CREATE POLICY "anon_delete_user_badges" ON user_badges FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_user_progress_device ON user_progress(device_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_device ON quiz_results(device_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_device ON user_badges(device_id);
