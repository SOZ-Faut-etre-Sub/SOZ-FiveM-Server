
CREATE TABLE IF NOT EXISTS `dpkeybinds` (
  `id` varchar(50) NULL DEFAULT NULL,
  `keybind1` varchar(50) NULL DEFAULT "num4",
  `emote1` varchar(255) NULL DEFAULT "",
  `keybind2` varchar(50) NULL DEFAULT "num5",
  `emote2` varchar(255) NULL DEFAULT "",
  `keybind3` varchar(50) NULL DEFAULT "num6",
  `emote3` varchar(255) NULL DEFAULT "",
  `keybind4` varchar(50) NULL DEFAULT "num7",
  `emote4` varchar(255) NULL DEFAULT "",
  `keybind5` varchar(50) NULL DEFAULT "num8",
  `emote5` varchar(255) NULL DEFAULT "",
  `keybind6` varchar(50) NULL DEFAULT "num9",
  `emote6` varchar(255) NULL DEFAULT ""
) ENGINE=InnoDB COLLATE=latin1_swedish_ci;