-- CreateIndex
CREATE INDEX `transmitter` ON `phone_calls`(`transmitter`);

-- CreateIndex
CREATE INDEX `receiver` ON `phone_calls`(`receiver`);

-- CreateIndex
CREATE INDEX `number` ON `phone_contacts`(`number`);

-- CreateIndex
CREATE INDEX `conversation_id` ON `phone_messages`(`conversation_id`);

-- CreateIndex
CREATE INDEX `conversation_id` ON `phone_messages_conversations`(`conversation_id`);

-- CreateIndex
CREATE INDEX `participant_identifier` ON `phone_messages_conversations`(`participant_identifier`);

-- CreateIndex
CREATE INDEX `number` ON `phone_profile`(`number`);

-- CreateIndex
CREATE INDEX `source_phone` ON `phone_society_messages`(`source_phone`);
