-- CreateTable
CREATE TABLE "roles" (
    "code" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "vehicle_types" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name_vi" TEXT NOT NULL,
    "name_en" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role_code" TEXT NOT NULL,
    "user_group" TEXT,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_role_code_fkey" FOREIGN KEY ("role_code") REFERENCES "roles" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "parking_lots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE'
);

-- CreateTable
CREATE TABLE "zones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lot_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "zones_lot_id_fkey" FOREIGN KEY ("lot_id") REFERENCES "parking_lots" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "zone_capacities" (
    "zone_id" TEXT NOT NULL,
    "vehicle_type_code" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    PRIMARY KEY ("zone_id", "vehicle_type_code"),
    CONSTRAINT "zone_capacities_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "zone_capacities_vehicle_type_code_fkey" FOREIGN KEY ("vehicle_type_code") REFERENCES "vehicle_types" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plate" TEXT NOT NULL,
    "qr_code" TEXT NOT NULL,
    "rfid_code" TEXT NOT NULL,
    "vehicle_type_code" TEXT NOT NULL,
    "owner_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vehicles_vehicle_type_code_fkey" FOREIGN KEY ("vehicle_type_code") REFERENCES "vehicle_types" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vehicles_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "parking_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicle_id" TEXT,
    "plate_snapshot" TEXT NOT NULL,
    "zone_id" TEXT NOT NULL,
    "vehicle_type_code" TEXT NOT NULL,
    "fee_group" TEXT NOT NULL,
    "id_method" TEXT NOT NULL,
    "entry_time" DATETIME NOT NULL,
    "exit_time" DATETIME,
    "entry_staff_id" TEXT NOT NULL,
    "exit_staff_id" TEXT,
    "status" TEXT NOT NULL,
    "reservation_id" TEXT,
    CONSTRAINT "parking_sessions_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "parking_sessions_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "parking_sessions_vehicle_type_code_fkey" FOREIGN KEY ("vehicle_type_code") REFERENCES "vehicle_types" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "parking_sessions_entry_staff_id_fkey" FOREIGN KEY ("entry_staff_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "parking_sessions_exit_staff_id_fkey" FOREIGN KEY ("exit_staff_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "parking_sessions_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "session_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "staff_id" TEXT NOT NULL,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "session_events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "parking_sessions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "session_events_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "zone_id" TEXT NOT NULL,
    "vehicle_type_code" TEXT NOT NULL,
    "arrival_time" DATETIME NOT NULL,
    "hold_until" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reservations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reservations_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reservations_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reservations_vehicle_type_code_fkey" FOREIGN KEY ("vehicle_type_code") REFERENCES "vehicle_types" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tariffs" (
    "vehicle_type_code" TEXT NOT NULL,
    "fee_group" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    PRIMARY KEY ("vehicle_type_code", "fee_group"),
    CONSTRAINT "tariffs_vehicle_type_code_fkey" FOREIGN KEY ("vehicle_type_code") REFERENCES "vehicle_types" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "paid_at" DATETIME NOT NULL,
    "confirmed_by_id" TEXT NOT NULL,
    CONSTRAINT "payments_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "parking_sessions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payments_confirmed_by_id_fkey" FOREIGN KEY ("confirmed_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "access_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "target" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "access_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plate_key" ON "vehicles"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_qr_code_key" ON "vehicles"("qr_code");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_rfid_code_key" ON "vehicles"("rfid_code");

-- CreateIndex
CREATE UNIQUE INDEX "parking_sessions_reservation_id_key" ON "parking_sessions"("reservation_id");

-- CreateIndex
CREATE INDEX "parking_sessions_status_zone_id_idx" ON "parking_sessions"("status", "zone_id");

-- CreateIndex
CREATE INDEX "reservations_status_zone_id_idx" ON "reservations"("status", "zone_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_session_id_key" ON "payments"("session_id");
