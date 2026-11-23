-- G-09 (FR-09): gate of each parking session's entry and exit.
ALTER TABLE "parking_sessions" ADD COLUMN "entry_gate" TEXT NOT NULL DEFAULT 'GATE-1';
ALTER TABLE "parking_sessions" ADD COLUMN "exit_gate" TEXT;
