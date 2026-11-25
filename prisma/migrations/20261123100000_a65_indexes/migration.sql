-- A-65, G-07 (P03 v0.4 §7): indexes only, no data change.

-- CreateIndex
CREATE INDEX "reservations_customer_id_status_idx" ON "reservations"("customer_id", "status");

-- CreateIndex
CREATE INDEX "parking_sessions_entry_time_idx" ON "parking_sessions"("entry_time");

-- CreateIndex
CREATE INDEX "access_logs_created_at_idx" ON "access_logs"("created_at");

-- CreateIndex
CREATE INDEX "access_logs_user_id_idx" ON "access_logs"("user_id");
