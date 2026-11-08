-- AlterTable: why a reservation was cancelled (D-41). Existing rows stay NULL.
ALTER TABLE "reservations" ADD COLUMN "cancel_reason" TEXT;
ALTER TABLE "reservations" ADD COLUMN "cancel_zone_id" TEXT REFERENCES "zones" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
