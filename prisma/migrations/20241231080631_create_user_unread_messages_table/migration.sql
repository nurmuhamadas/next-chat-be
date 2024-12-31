-- CreateTable
CREATE TABLE "user_unread_messages" (
    "user_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_unread_messages_room_id_key" ON "user_unread_messages"("room_id");
