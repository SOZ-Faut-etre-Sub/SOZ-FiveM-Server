-- CreateTable
CREATE TABLE `drugs_seedling` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `drug` VARCHAR(50) NOT NULL,
    `location` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `nb_water` INTEGER NOT NULL,
    `garden` VARCHAR(50),

    PRIMARY KEY (`id`)
);

CREATE TABLE `drugs_sell_location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `zone` TEXT NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY(`name`, `type`)
);

CREATE TABLE `drugs_garden_guest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `citizenid` VARCHAR(50) NOT NULL,
    `guest` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY(`citizenid`, `guest`)
);

INSERT INTO `drugs_sell_location` (`id`, `name`, `type`, `zone`) VALUES
	(1, 'El Rancho', 'sell_contract', '{"center": [495.12, -1823.68, 28.87], "heading": 50, "length": 1, "maxZ": 29.87, "minZ":27.87, "width": 0.4}'),
	(2, 'Paleto', 'sell_contract', '{"center": [-215.21, 6443.82, 31.31], "heading": 318, "length": 0.4, "maxZ": 32.31, "minZ":30.31, "width": 2.2}'),
	(3, 'Mirror Park', 'sell_contract', '{"center": [1257.28, -660.13, 67.75], "heading": 300, "length": 1, "maxZ": 68.75, "minZ": 66.75, "width": 0.6}'),
	(4, 'Marathon Avenue', 'sell_contract', '{"center": [-1455.25, -648.20, 33.38], "heading": 35, "length": 1, "maxZ": 34.38, "minZ": 32.38, "width": 0.6}'),
	(5, 'Sandy Shores', 'sell_contract', '{"center": [1720.75, 3852.52, 34.81], "heading": 308, "length": 0.4, "maxZ": 35.81, "minZ":33.81, "width": 1.2}'),
	(6, 'Chumash', 'sell_contract', '{"center": [-2997.75, 723.61, 28.50], "heading": 23, "length": 1.0, "maxZ": 29.50, "minZ": 27.50, "width": 1.0}'),
	(7, 'Forum Drive', 'sell_contract', '{"center": [-129.42, -1646.99, 36.51], "heading": 50, "length": 1.0, "maxZ": 37.51, "minZ": 35.51, "width": 1.0}'),
	(8, 'Little Seoul', 'sell_contract', '{"center": [-702.05, -1022.94, 16.11], "heading": 30, "length": 1.0, "maxZ": 17.11, "minZ": 15.11, "width": 1.0}'),
	(9, 'Power Street', 'sell_contract', '{"center": [224.25, -160.60, 58.76], "heading": 343, "length": 1, "maxZ": 59.76, "minZ": 57.76, "width": 1}'),
	(10, 'Prosperity Street', 'sell_contract', '{"center": [-1122.37, -1045.82, 1.15], "heading": 300, "length": 1.0, "maxZ": 2.15, "minZ": 0.15, "width": 0.4}'),
	(11, 'Alta', 'heavy_sell_contract', '{"center": [24.48, -211.52, 52.86], "heading": 0, "length": 8, "maxZ": 54.86, "minZ": 51.86, "width": 8}'),
	(12, 'Route 68', 'heavy_sell_contract', '{"center": [-106.37, 2795.83, 52.72], "heading": 0, "length": 8, "maxZ": 54.72, "minZ": 51.72, "width": 8}'),
	(13, 'Paleto Boulevard', 'heavy_sell_contract', '{"center": [79.11, 6641.83, 31.24], "heading": 45, "length": 8, "maxZ": 33.24, "minZ": 30.24, "width": 8}'),
	(14, 'Marina Drive', 'heavy_sell_contract', '{"center": [377.03, 3586.79, 33.13], "heading": 45, "length": 8, "maxZ": 35.13, "minZ": 32.13, "width": 8}'),
	(15, 'Camps des cul nus', 'heavy_sell_contract', '{"center": [-1096.61, 4945.37, 218.12], "heading": -25, "length": 8, "maxZ": 220.12, "minZ": 217.12, "width": 8}'),
	(16, 'Carson', 'heavy_sell_contract', '{"center": [410.28, -2069.6, 20.74], "heading": 45, "length": 8, "maxZ": 22.74, "minZ": 19.74, "width": 8}'),
	(17, 'Lindsay', 'heavy_sell_contract', '{"center": [-605.8, -1034.84, 21.33], "heading": 0, "length": 8, "maxZ": 23.33, "minZ": 21.74, "width": 8}'),
	(18, 'Innocence', 'heavy_sell_contract', '{"center": [-328.74, -1348.71, 30.98], "heading": 0, "length": 8, "maxZ": 32.98, "minZ": 29.98, "width": 8}'),
	(19, 'Elgin', 'heavy_sell_contract', '{"center": [548.52, -205.05, 52.89], "heading": 0, "length": 8, "maxZ": 54.89, "minZ": 51.89, "width": 8}'),
	(20, 'Grapeseed', 'heavy_sell_contract', '{"center": [1697.02, 4874.31, 41.8], "heading": 0, "length": 8, "maxZ": 43.8, "minZ": 40.8, "width": 8}');
