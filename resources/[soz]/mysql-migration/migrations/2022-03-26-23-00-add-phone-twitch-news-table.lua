table.insert(migrations, {
    name = "add-phone-twitch-news-table",
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `phone_twitch_news`
            (
                `id`              int(11)      NOT NULL AUTO_INCREMENT,
                `type`            varchar(512) NOT NULL,
                `image`           varchar(256) NULL,
                `message`         varchar(512) NOT NULL,
                `createdAt`       timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP(),
                PRIMARY KEY (id),
                INDEX `type` (`type`)
            );
        ]],
    },
});
