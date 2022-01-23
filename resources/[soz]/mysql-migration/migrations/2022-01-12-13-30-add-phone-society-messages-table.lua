table.insert(migrations, {
    name = "add-phone-society-messages-table",
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `phone_society_messages`
            (
                `id`              int(11)      NOT NULL AUTO_INCREMENT,
                `conversation_id` varchar(512) NOT NULL,
                `source_phone`    varchar(8)   NOT NULL,
                `message`         varchar(512) NOT NULL,
                `position`        json,
                `isTaken`         tinyint(4)   NOT NULL DEFAULT 0,
                `isDone`          tinyint(4)   NOT NULL DEFAULT 0,
                `createdAt`       timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP(),
                `updatedAt`       timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                INDEX `conversation_id` (`conversation_id`)
            );
        ]],
    },
});
