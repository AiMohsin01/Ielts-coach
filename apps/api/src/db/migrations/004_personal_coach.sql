CREATE TYPE task_status AS ENUM ('pending','completed','skipped');
CREATE TABLE study_plans (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, date DATE NOT NULL, task_type VARCHAR(50) NOT NULL, task_description TEXT NOT NULL, duration SMALLINT NOT NULL CHECK(duration BETWEEN 5 AND 240), status task_status NOT NULL DEFAULT 'pending', priority SMALLINT NOT NULL CHECK(priority BETWEEN 1 AND 5), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(user_id,date,task_type,task_description));
CREATE TABLE recommendations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, type VARCHAR(60) NOT NULL, reason TEXT NOT NULL, content JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE youtube_resources (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title VARCHAR(250) NOT NULL, youtube_url TEXT NOT NULL, skill VARCHAR(30) NOT NULL, topic VARCHAR(100) NOT NULL, difficulty VARCHAR(30) NOT NULL, band_level NUMERIC(2,1), is_published BOOLEAN NOT NULL DEFAULT FALSE, created_by UUID REFERENCES users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE vocabulary (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), word VARCHAR(120) NOT NULL UNIQUE, meaning TEXT NOT NULL, example_sentence TEXT NOT NULL, synonyms JSONB NOT NULL DEFAULT '[]', difficulty VARCHAR(30) NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE user_vocabulary (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, vocabulary_id UUID NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE, mastery_level SMALLINT NOT NULL DEFAULT 0 CHECK(mastery_level BETWEEN 0 AND 5), learned_at TIMESTAMPTZ, review_date DATE NOT NULL DEFAULT CURRENT_DATE, last_reviewed_at TIMESTAMPTZ, UNIQUE(user_id,vocabulary_id));
CREATE TABLE grammar_lessons (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title VARCHAR(250) NOT NULL, category VARCHAR(80) NOT NULL UNIQUE, description TEXT NOT NULL, content_url TEXT, difficulty VARCHAR(30) NOT NULL, is_published BOOLEAN NOT NULL DEFAULT FALSE, created_by UUID REFERENCES users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE grammar_errors (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, evaluation_type VARCHAR(20) NOT NULL CHECK(evaluation_type IN ('writing','speaking')), evaluation_id UUID NOT NULL, category VARCHAR(80) NOT NULL, example TEXT, correction TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX study_plans_user_date_idx ON study_plans(user_id,date);
CREATE INDEX user_vocabulary_review_idx ON user_vocabulary(user_id,review_date);
CREATE INDEX grammar_errors_user_category_idx ON grammar_errors(user_id,category);

CREATE OR REPLACE FUNCTION record_evaluation_grammar_errors() RETURNS TRIGGER AS $$
DECLARE item JSONB; learner UUID; kind TEXT;
BEGIN
  kind := TG_ARGV[0];
  IF kind = 'writing' THEN SELECT user_id INTO learner FROM writing_attempts WHERE id = NEW.attempt_id;
  ELSE SELECT user_id INTO learner FROM speaking_attempts WHERE id = NEW.attempt_id; END IF;
  FOR item IN SELECT value FROM jsonb_array_elements(COALESCE(NEW.feedback_json->'mistakes','[]'::jsonb)) LOOP
    IF lower(item->>'category') LIKE '%grammar%' OR lower(item->>'category') LIKE '%verb%' OR lower(item->>'category') LIKE '%article%' THEN
      INSERT INTO grammar_errors(user_id,evaluation_type,evaluation_id,category,example,correction) VALUES(learner,kind,NEW.id,item->>'category',item->>'explanation',item->>'correction');
    END IF;
  END LOOP;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER writing_grammar_error_memory AFTER INSERT ON writing_evaluations FOR EACH ROW EXECUTE FUNCTION record_evaluation_grammar_errors('writing');
CREATE TRIGGER speaking_grammar_error_memory AFTER INSERT ON speaking_evaluations FOR EACH ROW EXECUTE FUNCTION record_evaluation_grammar_errors('speaking');
