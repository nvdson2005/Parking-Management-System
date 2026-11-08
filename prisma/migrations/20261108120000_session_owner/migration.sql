-- AlterTable: immutable owner snapshot on each session (FR-28 privacy fix)
ALTER TABLE "parking_sessions" ADD COLUMN "owner_id" TEXT;

-- Backfill existing sessions with the vehicle's current owner (best available
-- information for rows created before this column existed).
UPDATE "parking_sessions"
SET "owner_id" = (SELECT "owner_id" FROM "vehicles" WHERE "vehicles"."id" = "parking_sessions"."vehicle_id")
WHERE "vehicle_id" IS NOT NULL;

-- CreateIndex
CREATE INDEX "parking_sessions_owner_id_idx" ON "parking_sessions"("owner_id");
