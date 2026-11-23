-- G-04 (FR-10): who recorded each entry and exit (DEVICE or MANUAL).
ALTER TABLE "parking_sessions" ADD COLUMN "entry_source" TEXT NOT NULL DEFAULT 'DEVICE';
ALTER TABLE "parking_sessions" ADD COLUMN "exit_source" TEXT;
