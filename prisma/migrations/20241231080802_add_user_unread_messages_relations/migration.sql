-- AddForeignKey
ALTER TABLE "user_unread_messages" ADD CONSTRAINT "user_unread_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
