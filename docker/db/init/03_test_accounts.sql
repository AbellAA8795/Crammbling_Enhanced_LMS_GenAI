--
-- Test accounts for LOCAL DEVELOPMENT ONLY (Docker database).
--
-- Lets you log in and run the API tests without setting up email/OTP.
-- Every account below uses the password:  Password123!
--
--   student1@crammbling.test   test_student1   student
--   student2@crammbling.test   test_student2   student
--   teacher@crammbling.test    test_teacher    teacher
--   admin@crammbling.test      test_admin      super_admin
--
-- These are fake, made-up accounts. Never add real people's data here.
-- Like the other init scripts, this runs only when the database volume is
-- empty; on an existing database, run it by hand:
--   docker compose exec -T db psql -U postgres -d Crammbling_DB < docker/db/init/03_test_accounts.sql
--

INSERT INTO auth.users (username, email, password_hash, auth_provider, is_verified, role)
VALUES
    ('test_student1', 'student1@crammbling.test', public.crypt('Password123!', public.gen_salt('bf')), 'local', true, 'student'),
    ('test_student2', 'student2@crammbling.test', public.crypt('Password123!', public.gen_salt('bf')), 'local', true, 'student'),
    ('test_teacher',  'teacher@crammbling.test',  public.crypt('Password123!', public.gen_salt('bf')), 'local', true, 'teacher'),
    ('test_admin',    'admin@crammbling.test',    public.crypt('Password123!', public.gen_salt('bf')), 'local', true, 'super_admin')
ON CONFLICT DO NOTHING;
