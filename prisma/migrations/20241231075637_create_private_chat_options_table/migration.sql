-- CreateTable
CREATE TABLE "private_chat_options" (
    "id" TEXT NOT NULL,
    "private_chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "notification" BOOLEAN NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "private_chat_options_pkey" PRIMARY KEY ("id")
);
