---
name: prisma-schema-update
description: Run Prisma migrations or database sync and regenerate Prisma Client after database changes. Use when schema/models/tables/columns/relations/enums change, or when tables are added directly in the database.
---

# Prisma Schema Update

## When To Use

Use this skill when any database structure changes happen and Prisma must be updated.

Common triggers:

- `prisma/schema.prisma` was edited
- Tables/columns were added, removed, or renamed
- Relations or enums changed
- Database was changed directly and Prisma schema/client must be synced

Trigger phrases to match:

- "run prisma migration"
- "update database schema"
- "new table added"
- "regenerate prisma client"
- "sync prisma with db"
- "schema changed, update prisma"

## Workflow

1. Ask the user first:
   - "Do you want to update an existing table or create a new table?"
2. Detect change source:
   - Prisma-first change (schema file edited)
   - DB-first change (tables changed directly in MySQL)
3. Collect table/model changes interactively (including multiple columns).
4. Ask whether new data type/enum definitions are needed before migration.
5. Summarize what changed (tables/models, columns/fields, relations, enums).
6. Run the correct command path.
7. Regenerate Prisma Client.
8. Report outcome and next steps.

## Prompt Handling

Use this exact prompt before running commands:

```text
Do you want to update an existing table or create a new table?
```

Then branch:

- If user says "update existing table":
  - Ask these questions one after another:
    1. `Table/model name?`
    2. `Which column do you want to add/update/remove first?`
    3. `Do you want to add another column? (proceed/done)`
  - Repeat step 3 until user says `done`.
- If user says "create new table":
  - Ask these questions one after another (do not combine):
    1. `Table/model name?`
    2. `First column + type?`
    3. `Do you want to add another column? (proceed/done)`
  - Repeat step 3 until user says `done`.
  - Then ask: `Relations (optional)?`
  - Wait for each answer before asking the next one.
  - Confirm the collected answers before running commands.
  - Then continue with normal Prisma-first or DB-first path.

Before running migration/sync commands, always ask:

```text
Do you need to add a new data type or enum before running migration? (yes/no)
```

If answer is `yes`:

- Ask for enum/type name and values/definition.
- Add/confirm that definition in `prisma/schema.prisma`.
- Reconfirm full change summary, then proceed.

## Command Paths

Run from the `BookWise/` project root (the folder with `package.json` and `prisma/`):

### A Prisma-first change (recommended)

```bash
npx prisma validate --schema prisma/schema.prisma
npx prisma migrate dev --schema prisma/schema.prisma
npx prisma generate --schema prisma/schema.prisma
```

### B DB-first change (tables changed directly in DB)

```bash
npx prisma db pull --schema prisma/schema.prisma
npx prisma generate --schema prisma/schema.prisma
```

### C Push-only fallback (when user asks to skip migration files)

```bash
npm run db:push
npx prisma generate --schema prisma/schema.prisma
```

## Change Summary Checklist

Before running commands, summarize:

- Added/removed tables or models
- Added/removed columns or fields
- Relation changes
- Enum changes
- New data type/enum added: yes/no
- Potentially destructive changes (drops/renames/type narrowing)
- Intent type: updated table or new table

## Safety Rules

- Stop and ask before applying potentially destructive changes.
- If migration fails, share the exact error and suggest the smallest safe fix.
- Do not edit unrelated files.
- Keep command output concise; include only key success/failure lines.
- Prefer path A (`migrate dev`) when schema file is the source of truth.
- Use path B (`db pull`) when the database was changed outside Prisma.
- Use path C (`db:push`) only when explicitly requested to skip migration-file creation.

## Final Response Format

Use this structure:

```markdown
Prisma database update completed.

- Change source: <Prisma-first or DB-first>
- Validation: <pass/fail or skipped>
- Migration/Sync: <command + result>
- Prisma Client: <generated/not generated>
- Structure changes: <short bullets>
- Next step: <if any>
```
