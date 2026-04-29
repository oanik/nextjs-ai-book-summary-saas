---
name: prisma-production-deploy
description: Apply Prisma migrations safely in production/staging and regenerate Prisma Client. Use when deploying database changes to non-local environments, CI/CD pipelines, or servers where migrate dev must not be used.
---

# Prisma Production Deploy

## When To Use

Use this skill for staging/production database deployments.

Common triggers:

- Deploying schema changes to server environments
- Running DB changes in CI/CD
- Applying already-created migration files safely

## Rules

- Never use `prisma migrate dev` in production/staging.
- Use committed migration files only.
- Stop and ask if pending local schema edits are not migrated yet.

## Workflow

1. Ask the user first:
   - "Are you deploying an update to existing tables or a new table release?"
2. If the user says "update existing table", ask these questions one after another:
   1. `Table/model name?`
   2. `Which column do you want to add/update/remove first?`
   3. `Do you want to add another column? (proceed/done)`
   Repeat step 3 until user says `done`.
3. If the user says "new table release", ask these questions one after another:
   1. `Table/model name?`
   2. `First column + type?`
   3. `Do you want to add another column? (proceed/done)`
   Repeat step 3 until user says `done`.
   Then ask: `Relations (optional)?`
4. Before running deploy commands, always ask:

```text
Do you need to add a new data type or enum before running migration deploy? (yes/no)
```

5. If answer is `yes`:
   - Ask for enum/type name and values/definition.
   - Confirm this definition is already included in `prisma/schema.prisma` and in committed migration files.
6. Confirm environment is non-local (staging/production/CI).
7. Validate migration files are present in `prisma/migrations`.
8. Apply migrations with deploy command.
9. Regenerate Prisma Client.
10. Report concise outcome and any follow-up actions.

## Commands

Run from the project root:

```bash
npx prisma migrate deploy --schema prisma/schema.prisma
npx prisma generate --schema prisma/schema.prisma
```

## Failure Handling

- If `migrate deploy` fails, report the exact error and stop.
- Do not attempt destructive resets on production/staging.
- Suggest creating/fixing migrations in development, then redeploy.
- Do not run deploy if schema or enum/type changes are not represented in committed migration files yet.

## Final Response Format

Use this structure:

```markdown
Prisma production deploy completed.

- Environment: <staging/production/CI>
- Migration deploy: <command + result>
- Prisma Client: <generated/not generated>
- Next step: <if any>
```
