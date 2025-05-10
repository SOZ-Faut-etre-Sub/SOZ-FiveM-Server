-- CreateTable
CREATE TABLE `casino_tables` (
    `id` VARCHAR(128) NOT NULL,
    `kind` ENUM('poker', 'blackjack', 'roulette') NOT NULL,
    `position` TEXT NOT NULL,
    `model` VARCHAR(50) NOT NULL,
    `type` ENUM('base', 'highLimit') NOT NULL DEFAULT 'base',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create default data
INSERT INTO `casino_tables` VALUES
    -- poker
    (uuid(), 'poker', '{"x":1148.74, "y":251.6947, "z":-52.0409, "w":-45.0}', 'vw_prop_casino_3cardpoker_01b', 'highLimit'),
    (uuid(), 'poker', '{"x":1146.329, "y":261.2543, "z":-52.8409, "w":45.0}', 'vw_prop_casino_3cardpoker_01', 'base'),
    (uuid(), 'poker', '{"x":1143.3379, "y":264.2453, "z":-52.8409, "w":-135.0}', 'vw_prop_casino_3cardpoker_01', 'base'),
    (uuid(), 'poker', '{"x":1133.74, "y":266.6947, "z":-52.0409, "w":-45.0}', 'vw_prop_casino_3cardpoker_01b', 'highLimit'),
    -- blackjack
    (uuid(), 'blackjack', '{"x":1148.8368, "y":269.747, "z":-52.8409, "w":-134.69}', 'vw_prop_casino_blckjack_01b', 'highLimit'),
    (uuid(), 'blackjack', '{"x":1151.84, "y":266.747, "z":-52.8409, "w":45.31}', 'vw_prop_casino_blckjack_01b', 'base'),
    (uuid(), 'blackjack', '{"x":1129.4065, "y":262.3578, "z":-52.041, "w":135.31}', 'vw_prop_casino_blckjack_01b', 'base'),
    (uuid(), 'blackjack', '{"x":1144.4291, "y":247.3352, "z":-52.041, "w":135.31}', 'vw_prop_casino_blckjack_01b', 'highLimit');
    -- roulette
