table.insert(migrations, {
    name = 'add-phone-tables',
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `phone_calls`
            (
                `id`          int(11)      NOT NULL AUTO_INCREMENT,
                `identifier`  varchar(48)  DEFAULT NULL,
                `transmitter` varchar(8)   NOT NULL,
                `receiver`    varchar(8)   NOT NULL,
                `is_accepted` tinyint(4)   DEFAULT 0,
                `start`       timestamp    DEFAULT CURRENT_TIMESTAMP(),
                `end`         timestamp,
                PRIMARY KEY (id),
                INDEX `identifier` (`identifier`)
            );
        ]],
        [[
            CREATE TABLE IF NOT EXISTS `phone_messages`
            (
                `id`              int(11)      NOT NULL AUTO_INCREMENT,
                `message`         varchar(512) NOT NULL,
                `user_identifier` varchar(48)  NOT NULL,
                `conversation_id` varchar(128) NOT NULL,
                `isRead`          tinyint(4)   NOT NULL DEFAULT 0,
                `visible`         tinyint(4)   NOT NULL DEFAULT 1,
                `author`          varchar(8)   NOT NULL,
                `createdAt`       timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP(),
                `updatedAt`       timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                INDEX `user_identifier` (`user_identifier`)
            );
        ]],
        [[
            CREATE TABLE IF NOT EXISTS `phone_messages_conversations`
            (
                `id`                     int(11)      NOT NULL AUTO_INCREMENT,
                `user_identifier`        varchar(8)   NOT NULL,
                `conversation_id`        varchar(128) NOT NULL,
                `participant_identifier` varchar(8)   NOT NULL,
                `label`                  varchar(60)  DEFAULT '',
                `unreadCount`            int(11)      NOT NULL DEFAULT 0,
                `unread`                 int(11)      DEFAULT NULL,
                `createdAt`              timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP(),
                `updatedAt`              timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                INDEX `user_identifier` (`user_identifier`)
            );
        ]],
        [[
            CREATE TABLE IF NOT EXISTS `phone_contacts`
            (
                `id`         int(11)      NOT NULL AUTO_INCREMENT,
                `identifier` varchar(48)  DEFAULT NULL,
                `avatar`     varchar(255) DEFAULT NULL,
                `number`     varchar(8)   DEFAULT NULL,
                `display`    varchar(255) NOT NULL DEFAULT '',
                PRIMARY KEY (`id`),
                INDEX `identifier` (`identifier`)
            );
        ]],
        [[
            CREATE TABLE IF NOT EXISTS `phone_gallery`
            (
                `id`         int(11)      NOT NULL AUTO_INCREMENT,
                `identifier` varchar(48) DEFAULT NULL,
                `image`      varchar(255) NOT NULL,
                PRIMARY KEY (id),
                INDEX `identifier` (`identifier`)
            );
        ]],
        [[
            CREATE TABLE IF NOT EXISTS `phone_notes`
            (
                `id`         int(11)      NOT NULL AUTO_INCREMENT,
                `identifier` varchar(48)  NOT NULL,
                `title`      varchar(255) NOT NULL,
                `content`    varchar(255) NOT NULL,
                PRIMARY KEY (id),
                INDEX `identifier` (`identifier`)
            );
        ]]
    }
});
