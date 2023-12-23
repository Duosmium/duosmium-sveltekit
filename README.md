# Duosmium Results

This repository contains the codebase for the next version of [Duosmium Results](https;//www.duosmium.org), written using SvelteKit, Supabase, Tailwind, and shadcn-svelte.

You can access the production instance here: <https://next.duosmium.org>

This website is a work in progress and does not contain every feature of the standard website.
It likely will not have up-to-date results either. Do not rely on it for anything important.

If you spot any bugs or have any feedback, email [duosmium@gmail.com](mailto:duosmium@gmail.com).

## Development

To develop this site, you'll need to have Node.js, NPM, and Docker installed.

Steps:

- Clone this repository.
- Run `cp .env.example .env`.
- Run `npm i`.
- Run `supabase start`.
  - If this doesn't work, try `./node_modules/.bin/supabase start`.
- The previous command will paste some output. Copy the anon key and put it in the `PUBLIC_SUPABASE_ANON_KEY` variable in `.env`.
- Run `npx prisma db push` to set up the database.
- Run `npm run dev` to start the dev server. The website is located at <http://localhost:5173>.

To upload files, you'll need an admin account. Visit <http://localhost:54323>, go to "Authentication" on the left-hand side,
and create a new account. After that, go to the SQL Editor and run the following:

```sql
UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"admin": true}' WHERE email = 'me@duosmium.org';
```

This will mark your account as an administrator. You can then add results by going to <http://localhost:5173/admin/upload>, logging in, and uploading YAML files.
