-- Worker-hosted custom shapes use bounded private image storage in Postgres.
ALTER TABLE "assets" ADD COLUMN "content_bytes" BYTEA;
