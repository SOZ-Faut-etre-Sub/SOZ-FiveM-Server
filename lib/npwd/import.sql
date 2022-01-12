# comment this out if your server has a different table/location for phone_number
# or if it already exists in the users table
#

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
