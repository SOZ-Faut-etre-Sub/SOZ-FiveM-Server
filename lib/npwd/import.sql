# comment this out if your server has a different table/location for phone_number
# or if it already exists in the users table
#
ALTER TABLE `players` ADD COLUMN `phone_number` VARCHAR(20) DEFAULT NULL;

CREATE TABLE IF NOT EXISTS `npwd_phone_contacts`
(
    `id`         int(11)      NOT NULL AUTO_INCREMENT,
    `identifier` varchar(48)           DEFAULT NULL,
    `avatar`     varchar(255)          DEFAULT NULL,
    `number`     varchar(20)           DEFAULT NULL,
    `display`    varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`id`),
    INDEX `identifier` (`identifier`)
);

CREATE TABLE IF NOT EXISTS `npwd_notes`
(
    `id`         int(11)      NOT NULL AUTO_INCREMENT,
    `identifier` varchar(48)  NOT NULL,
    `title`      varchar(255) NOT NULL,
    `content`    varchar(255) NOT NULL,
    PRIMARY KEY (id),
    INDEX `identifier` (`identifier`)
);

CREATE TABLE IF NOT EXISTS `npwd_marketplace_listings`
(
    `id`          int(11)      NOT NULL AUTO_INCREMENT,
    `identifier`  varchar(48)           DEFAULT NULL,
    `username`    varchar(255)          DEFAULT NULL,
    `name`        varchar(50)           DEFAULT NULL,
    `number`      varchar(255) NOT NULL,
    `title`       varchar(255)          DEFAULT NULL,
    `url`         varchar(255)          DEFAULT NULL,
    `description` varchar(255) NOT NULL,
    `createdAt`   timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`   timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `reported`    tinyint      NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
    INDEX `identifier` (`identifier`)
);

CREATE TABLE IF NOT EXISTS `npwd_messages`
(
    `id`              int(11)      NOT NULL AUTO_INCREMENT,
    `message`         varchar(512) NOT NULL,
    `user_identifier` varchar(48)  NOT NULL,
    `conversation_id` varchar(512) NOT NULL,
    `isRead`          tinyint(4)   NOT NULL DEFAULT 0,
    `createdAt`       timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updatedAt`       timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP,
    `visible`         tinyint(4)   NOT NULL DEFAULT 1,
    `author`          varchar(255) NOT NULL,
    PRIMARY KEY (id),
    INDEX `user_identifier` (`user_identifier`)
);

CREATE TABLE IF NOT EXISTS `npwd_messages_conversations`
(
    `id`                     int(11)      NOT NULL AUTO_INCREMENT,
    `user_identifier`        varchar(48)  NOT NULL,
    `createdAt`              timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `updatedAt`              timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP,
    `conversation_id`        varchar(512) NOT NULL,
    `participant_identifier` varchar(48)  NOT NULL,
    `label`                  varchar(60)           DEFAULT '',
    `unreadCount`            int(11)      NOT NULL DEFAULT 0,
    `unread`                 int(11)               DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX `user_identifier` (`user_identifier`)
);
CREATE TABLE IF NOT EXISTS `npwd_calls`
(
    `id`          int(11)      NOT NULL AUTO_INCREMENT,
    `identifier`  varchar(48)  DEFAULT NULL,
    `transmitter` varchar(255) NOT NULL,
    `receiver`    varchar(255) NOT NULL,
    `is_accepted` tinyint(4)   DEFAULT 0,
    `start`       varchar(255) DEFAULT NULL,
    end           varchar(255) DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX `identifier` (`identifier`)
);

CREATE TABLE IF NOT EXISTS `npwd_phone_gallery`
(
    `id`         int(11)      NOT NULL AUTO_INCREMENT,
    `identifier` varchar(48) DEFAULT NULL,
    `image`      varchar(255) NOT NULL,
    PRIMARY KEY (id),
    INDEX `identifier` (`identifier`)
);
