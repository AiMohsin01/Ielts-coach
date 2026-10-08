ALTER TABLE study_plans ADD COLUMN task_title TEXT;
ALTER TABLE study_plans ADD COLUMN resource_path TEXT;
ALTER TABLE study_plans ADD COLUMN task_reason TEXT;
ALTER TABLE study_plans ADD COLUMN phase TEXT;
ALTER TABLE profiles ADD COLUMN roadmap_started_on DATE;
ALTER TABLE profiles ADD COLUMN roadmap_ends_on DATE;
