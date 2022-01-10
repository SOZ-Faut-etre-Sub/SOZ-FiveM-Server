CREATE TABLE IF NOT EXISTS `player_temp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `license` varchar(255) DEFAULT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `birthdate` varchar(10) DEFAULT NULL,
  `gender` int(1) DEFAULT NULL,
  `spawn` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1;

INSERT INTO player_temp (license, firstname, lastname, nationality, birthdate, gender, spawn) VALUES
 (license, :firstname, :lastname, :nationality, :birthdate, :gender, :spawn) 
ON DUPLICATE KEY UPDATE license = :license, firstname = :firstname, lastname = :lastname, nationality = :nationality, birthdate = :birthdate, gender = :gender, spawn = :spawn)