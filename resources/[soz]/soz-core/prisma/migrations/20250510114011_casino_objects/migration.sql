-- CreateTable
CREATE TABLE `casino_objects` (
    `id` VARCHAR(128) NOT NULL,
    `kind` ENUM('poker', 'blackjack', 'roulette', 'slotMachine') NOT NULL,
    `position` TEXT NOT NULL,
    `model` VARCHAR(50) NOT NULL,
    `type` ENUM('base', 'highLimit') NOT NULL DEFAULT 'base',
    `requireSpawn` BOOLEAN NOT NULL DEFAULT false,
    `houseEdge` DOUBLE NOT NULL DEFAULT 100,
    `metadata` TEXT NULL,

    INDEX `kind`(`kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create default data
INSERT INTO `casino_objects`(`id`,`kind`,`position`,`model`,`type`,`requireSpawn`,`houseEdge`) VALUES
    -- poker
    (uuid(), 'poker', '{"x":993.2344, "y":43.61603, "z":69.23276, "w":280}', 'vw_prop_casino_3cardpoker_01b', 'highLimit', true, 10),
    (uuid(), 'poker', '{"x":991.465, "y":40.09433, "z":69.23276, "w":203}', 'vw_prop_casino_3cardpoker_01b', 'highLimit', true, 10),
    (uuid(), 'poker', '{"x":996.3485, "y":51.73592, "z":68.43275, "w":323}', 'vw_prop_casino_3cardpoker_01', 'base', true, 10),
    (uuid(), 'poker', '{"x":1000.784, "y":51.02497, "z":68.43275, "w":13}', 'vw_prop_casino_3cardpoker_01', 'base', true, 10),
    (uuid(), 'poker', '{"x":998.4394, "y":61.03186, "z":68.43275, "w":193}', 'vw_prop_casino_3cardpoker_01', 'base', true, 10),
    (uuid(), 'poker', '{"x":994.9095, "y":58.21835, "z":68.43275, "w":243}', 'vw_prop_casino_3cardpoker_01', 'base', true, 10),
    (uuid(), 'poker', '{"x":988.4625, "y":64.28557, "z":69.23276, "w":283}', 'vw_prop_casino_3cardpoker_01b', 'highLimit', true, 10),
    (uuid(), 'poker', '{"x":985.048, "y":66.63026, "z":69.23276, "w":8}', 'vw_prop_casino_3cardpoker_01b', 'highLimit', true, 10),
    -- blackjack
    (uuid(), 'blackjack', '{"x":987.2684, "y":42.20339, "z":69.23269, "w":103}', 'vw_prop_casino_blckjack_01b', 'highLimit', true, 10),
    (uuid(), 'blackjack', '{"x":989.0378, "y":45.7245, "z":69.23269, "w":23}', 'vw_prop_casino_blckjack_01b', 'highLimit', true, 10),
    (uuid(), 'blackjack', '{"x":1003.96619, "y":53.3181877, "z":68.43275, "w":58}', 'vw_prop_casino_blckjack_01', 'base', true, 10),
    (uuid(), 'blackjack', '{"x":1002.23804, "y":60.3174, "z":68.43275, "w":143}', 'vw_prop_casino_blckjack_01', 'base', true, 10),
    (uuid(), 'blackjack', '{"x":985.9037, "y":60.55936, "z":69.23269, "w":188}', 'vw_prop_casino_blckjack_01b', 'highLimit', true, 10),
    (uuid(), 'blackjack', '{"x":982.4893, "y":62.90397, "z":69.23269, "w":103}', 'vw_prop_casino_blckjack_01b', 'highLimit', true, 10),
    -- roulette
    (uuid(), 'roulette', '{"x":985.9124, "y":49.01048, "z":69.23275, "w":225}', 'vw_prop_casino_roulette_01b', 'highLimit', true, 0),
    (uuid(), 'roulette', '{"x":982.1644, "y":52.20396, "z":69.23276, "w":283}', 'vw_prop_casino_roulette_01b', 'highLimit', true, 0),
    (uuid(), 'roulette', '{"x":984.3021, "y":55.93538, "z":69.23275, "w":342}', 'vw_prop_casino_roulette_01b', 'highLimit', true, 0),
    (uuid(), 'roulette', '{"x":1004.5155, "y":57.22153, "z":68.43275, "w":283}', 'vw_prop_casino_roulette_01', 'base', true, 0),
    (uuid(), 'roulette', '{"x":999.8859, "y":54.40334, "z":68.43275, "w":13}', 'vw_prop_casino_roulette_01', 'base', true, 0),
    (uuid(), 'roulette', '{"x":999.4816, "y":57.88892, "z":68.43275, "w":193}', 'vw_prop_casino_roulette_01', 'base', true, 0);
