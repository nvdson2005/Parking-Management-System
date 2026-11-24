-- G-01 (FR-22, Q37): opening hours of a lot, HH:mm, for information only.
ALTER TABLE "parking_lots" ADD COLUMN "open_time" TEXT;
ALTER TABLE "parking_lots" ADD COLUMN "close_time" TEXT;
