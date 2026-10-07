CREATE TABLE library_activity (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  study_date DATE NOT NULL,
  PRIMARY KEY(user_id,study_date)
);
CREATE TABLE learning_leaderboard (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name VARCHAR(40) NOT NULL,
  visible BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE typing_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wpm INTEGER NOT NULL CHECK(wpm BETWEEN 0 AND 500),
  accuracy NUMERIC(5,2) NOT NULL CHECK(accuracy BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
