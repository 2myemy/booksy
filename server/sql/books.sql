DO $$ BEGIN
  CREATE TYPE book_condition AS ENUM (
    'NEW','LIKE_NEW','VERY_GOOD','GOOD','ACCEPTABLE'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE book_status AS ENUM ('ACTIVE','SOLD','REMOVED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS books (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  author        TEXT NOT NULL,
  price_cents   INTEGER NOT NULL CHECK (price_cents >= 0),
  currency      CHAR(3) NOT NULL DEFAULT 'USD',
  condition     book_condition NOT NULL,
  status        book_status NOT NULL DEFAULT 'ACTIVE',
  owner_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_image_url TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_books_updated_at
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
