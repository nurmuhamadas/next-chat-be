-- AddForeignKey
ALTER TABLE "private_chat_options" ADD CONSTRAINT "private_chat_options_private_chat_id_fkey" FOREIGN KEY ("private_chat_id") REFERENCES "private_chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_chat_options" ADD CONSTRAINT "private_chat_options_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
