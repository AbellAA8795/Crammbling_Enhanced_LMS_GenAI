
<--for google account-->
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);


ALTER TABLE users
    ALTER COLUMN password_hash DROP NOT NULL,   -- only if it currently has NOT NULL
    ADD COLUMN google_id VARCHAR(255) UNIQUE,
    ADD COLUMN avatar_url TEXT,
    ADD COLUMN auth_provider VARCHAR(20) NOT NULL DEFAULT 'local', -- 'local' or 'google'
    ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT false;

-- Existing local accounts are effectively "unverified" until you add OTP,
-- but this defaults new Google signups to verified automatically (see procedure below).