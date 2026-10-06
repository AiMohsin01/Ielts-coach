# Beta launch guide

## Launch steps

1. Run migrations, then seed staging content only.
2. Create separate admin and content-manager accounts with unique strong passwords.
3. Publish and review every learning item; verified content must be marked approved before promotion.
4. Test signup, onboarding, practice, recording consent, feedback, reports, PWA installation, and mobile layouts.
5. Run E2E tests and inspect the beta dashboard daily after launch.

## Student onboarding guide

Students register, complete their IELTS profile, choose consent options, generate a daily plan, and start a skill module. They can submit beta feedback at `/beta` and download their report from `/report`.

## Admin guide

Manage material at `/admin/content`, review QA metrics at `/admin/beta`, check calibration records through `/api/qa/evaluation-tests`, and resolve beta/community reports promptly.

## Troubleshooting

If AI feedback is unavailable, keep practice enabled and check the configured local provider. If uploads fail, verify consent, storage permissions, and request size. If users cannot sign in, verify `CLIENT_URL`, cookie HTTPS settings, and `JWT_SECRET`.
