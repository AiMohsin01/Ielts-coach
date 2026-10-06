CREATE TABLE writing_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL UNIQUE REFERENCES writing_attempts(id) ON DELETE CASCADE,
  task_response_score NUMERIC(2,1) NOT NULL CHECK (task_response_score BETWEEN 0 AND 9),
  coherence_score NUMERIC(2,1) NOT NULL CHECK (coherence_score BETWEEN 0 AND 9),
  lexical_score NUMERIC(2,1) NOT NULL CHECK (lexical_score BETWEEN 0 AND 9),
  grammar_score NUMERIC(2,1) NOT NULL CHECK (grammar_score BETWEEN 0 AND 9),
  overall_band NUMERIC(2,1) NOT NULL CHECK (overall_band BETWEEN 0 AND 9),
  feedback_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE speaking_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL UNIQUE REFERENCES speaking_attempts(id) ON DELETE CASCADE,
  transcript TEXT NOT NULL,
  fluency_score NUMERIC(2,1) NOT NULL CHECK (fluency_score BETWEEN 0 AND 9),
  lexical_score NUMERIC(2,1) NOT NULL CHECK (lexical_score BETWEEN 0 AND 9),
  grammar_score NUMERIC(2,1) NOT NULL CHECK (grammar_score BETWEEN 0 AND 9),
  pronunciation_score NUMERIC(2,1) NOT NULL CHECK (pronunciation_score BETWEEN 0 AND 9),
  overall_band NUMERIC(2,1) NOT NULL CHECK (overall_band BETWEEN 0 AND 9),
  feedback_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE student_weaknesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill VARCHAR(20) NOT NULL CHECK (skill IN ('writing','speaking')),
  category VARCHAR(80) NOT NULL,
  label VARCHAR(200) NOT NULL,
  occurrence_count INTEGER NOT NULL DEFAULT 1,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, skill, category)
);
CREATE INDEX writing_evaluations_created_idx ON writing_evaluations(created_at DESC);
CREATE INDEX speaking_evaluations_created_idx ON speaking_evaluations(created_at DESC);
CREATE INDEX student_weaknesses_user_idx ON student_weaknesses(user_id, occurrence_count DESC);
