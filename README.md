# Ielts-coach

IELTS AI Coach — personalized IELTS preparation.

The redesigned workspace includes a free content library with 11 modules and 294 YouTube lesson entries, Bengali study notes, saved learner progress, private notes, and the full navigation menu. Run all database migrations before starting the updated API. Local AI features require Ollama; live AI calls, paid checkout, and referral payouts are not enabled.

Phase 1 provides the secure foundation: JWT authentication, student profile onboarding, and a responsive student dashboard. Phase 2 adds the IELTS practice data model and student flows for Listening, Reading, Writing, and Speaking.

## Start locally

1. `cp .env.example .env` and replace `JWT_SECRET` and the database password.
2. `docker compose up -d`
3. `npm install`
4. `npm run db:migrate`
5. `npm run dev`

Open `http://localhost:3000`. The API runs on `http://localhost:4000`.

For a ready-to-explore local installation, run `npm run db:seed` after migration. It creates a content-manager account (`content@ieltscoach.local`, password `ChangeMe123!`), one small sample for each practice skill, vocabulary cards, grammar lessons, and example YouTube resources. Change this password immediately if exposed outside local development.

## Free-first AI setup

No paid API is required. The default `AI_PROVIDER=local` targets an Ollama-compatible local model at `http://localhost:11434`; install Ollama and run `ollama pull llama3.2` to enable text evaluation. For local speech-to-text, point `LOCAL_TRANSCRIPTION_URL` at a Whisper-compatible transcription service. Students can use every non-AI practice feature without either service.

`AI_PROVIDER=openai` remains optional for deployments that choose to configure an OpenAI key; it is never required for the platform to operate.

## Roles

Public registration creates student accounts only. Admin and content-manager accounts must be provisioned by an administrator, preventing privilege escalation through the public sign-up endpoint.

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/profile`
- `PUT /api/profile`

## Practice content and testing

Content is deliberately API-managed in Phase 2. Sign in as a provisioned `admin` or `content_manager` account, then create and publish a test/task before it appears for students.

- Listening: `POST /api/practice/listening/tests`, then sections, questions, and `multipart/form-data` audio to `/api/practice/listening/sections/:sectionId/audio`.
- Reading: `POST /api/practice/reading/tests`, then passages and questions.
- Writing: `POST /api/practice/writing/tasks` with a `taskType` of `task_1` or `task_2` and an appropriate category.
- Speaking: `POST /api/practice/speaking/tests`, then questions using `part_1`, `part_2`, or `part_3`.

Student pages are available at `/practice/listening`, `/practice/reading`, `/practice/writing`, and `/practice/speaking`. Listening and Reading answers are objectively scored when submitted. Writing submissions and speaking recordings are saved without AI scoring, as intended for this phase.

Uploaded audio is stored in `apps/api/uploads` for local development. Use object storage with signed URLs before deploying to production.

## AI evaluation (Phase 3)

Set `OPENAI_API_KEY` and, optionally, the model variables in `.env`. The provider adapter is isolated in `apps/api/src/services/ai`, so another provider can be added without changing evaluation routes.

- `POST /api/evaluations/writing/attempts/:attemptId` evaluates a saved writing response.
- `POST /api/evaluations/speaking/attempts/:attemptId` transcribes its stored audio, then evaluates the response.
- `GET /api/evaluations/history` returns writing/speaking band history plus the learner's repeated weaknesses.

The feedback view is `/feedback`. AI scores are practice estimates, not official IELTS scores. Speaking pronunciation feedback is necessarily qualified when it is inferred from a transcript.

## Personal coach and recommendations (Phase 4)

- `POST /api/coach/plan/generate` produces today’s prioritized study plan.
- `GET /api/coach/dashboard` provides tasks, recommendations, vocabulary status, streak, exam countdown, and band prediction.
- `PATCH /api/coach/plan/:id` marks a task `completed`, `skipped`, or `pending`.
- `GET|POST /api/coach/resources` manages published YouTube resources (POST requires content-manager/admin).
- `GET|POST /api/coach/vocabulary`, `PATCH /api/coach/vocabulary/:id` provide academic-word flashcards and spaced review progress.
- `GET|POST /api/coach/grammar` provides error-prioritized grammar lessons (POST requires content-manager/admin).

Student pages: `/coach` and `/vocabulary`.

## Quality and deployment

Run `RUN_E2E=true npm run test:e2e` against a dedicated, migrated and seeded staging database after starting the API. Add `RUN_AI_E2E=true` only when a configured local or optional AI provider is available. See [deployment documentation](docs/DEPLOYMENT.md) for the web/API/database launch order.

## Beta and content operations

Staff content APIs live under `/api/admin/content/:kind`, where `kind` is `listening`, `reading`, `writing`, `speaking`, `vocabulary`, `grammar`, or `resources`. Content managers can list, publish/unpublish, and update metadata; only admins can delete. Students submit beta reports at `POST /api/beta/feedback`. Their client-side practice telemetry is accepted by `POST /api/beta/events` and summarized at `GET /api/beta/analytics`.

Phase 7 metadata includes difficulty, target band, topic, estimated time, and tags where appropriate. The translation foundation is in `apps/web/lib/i18n.ts`, currently containing English and Bangla keys without a whole-product translation.

## Community and beta engagement

Student community endpoints are under `/api/community`: posts, comments, reports, activity streak updates, and engagement data. The student pages are `/community`, `/beta`, and `/report`. The report page supports Print/Save PDF from the browser and a downloadable data export without requiring any paid report-generation service.

### Public beta checklist

1. Verify registration, onboarding, login/logout, and role permissions.
2. Publish enough Listening, Reading, Writing, Speaking, Vocabulary, Grammar, and YouTube content for an initial cohort.
3. Run migrations and end-to-end tests against staging.
4. Verify secure secrets, HTTPS, CORS origin, rate limits, and reporting/moderation workflows.
5. Test mobile recording, touch controls, PWA installation, report export, and low-bandwidth behavior.
6. Monitor `/beta` submissions and community reports daily during the beta.

## Beta quality assurance and privacy

Phase 9 adds AI calibration records at `/api/qa/evaluation-tests`, beta launch metrics at `/api/qa/dashboard`, privacy preferences at `/api/privacy/settings`, and user data deletion requests at `/api/privacy/deletion-request`. The privacy UI is `/privacy`; the beta admin dashboard is `/admin/beta`. Review [BETA_LAUNCH.md](docs/BETA_LAUNCH.md) for launch steps, student/admin guides, and troubleshooting.

The `008_beta_qa.sql` migration adds review status, verified-content flags, content explanations, calibration samples, privacy settings, deletion requests, and indexes for frequent learner/report queries.

The authentication token is an HttpOnly, SameSite=Lax cookie. Future APIs should use the `requireAuth` middleware and enforce `requireRole` where applicable.
