CREATE TABLE "user_sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" jsonb NOT NULL,
  "expire" timestamp(6) NOT NULL
);

ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("sid");

CREATE INDEX "IDX_user_sessions_expire" ON "user_sessions" ("expire");