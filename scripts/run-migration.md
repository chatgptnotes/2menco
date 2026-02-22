# Running the Database Migration

## Option 1: Supabase Dashboard SQL Editor
1. Go to https://supabase.com/dashboard/project/vtdokcsxdzdwgaatytab/sql
2. Copy the contents of `supabase/migrations/001_initial.sql`
3. Paste into the SQL editor and click "Run"

## Option 2: After migration, seed data
```bash
npx tsx scripts/seed.ts
```

This will insert demo agents, KPIs, leads, proposals, tasks, and activity logs.
