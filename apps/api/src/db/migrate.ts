import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { pool } from "./pool.js";

async function migrate() {
  await pool.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
  await pool.query("CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");
  for (const name of ["001_initial.sql", "002_practice_modules.sql", "003_ai_evaluations.sql", "004_personal_coach.sql", "005_launch_readiness.sql", "006_content_beta.sql", "007_community_engagement.sql", "008_beta_qa.sql", "009_learning_library.sql", "010_workspace_tools.sql"]) {
  const applied = await pool.query("SELECT 1 FROM schema_migrations WHERE name = $1", [name]);
  if (!applied.rowCount) {
    const sql = await readFile(join(process.cwd(), "src/db/migrations", name), "utf8");
    await pool.query("BEGIN");
    try { await pool.query(sql); await pool.query("INSERT INTO schema_migrations(name) VALUES ($1)", [name]); await pool.query("COMMIT"); }
    catch (error) { await pool.query("ROLLBACK"); throw error; }
  }}
  await pool.end();
}
migrate().catch((error) => { console.error(error); process.exit(1); });
