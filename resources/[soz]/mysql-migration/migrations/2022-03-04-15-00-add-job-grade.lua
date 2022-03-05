table.insert(migrations, {
    name = "add-job-grades",
    queries = {
        [[
            CREATE TABLE IF NOT EXISTS `job_grades` (
              id int(11) NOT NULL AUTO_INCREMENT,
              jobId varchar(50) NOT NULL,
              name varchar(50) NOT NULL,
              salary int(11) DEFAULT 0,
              owner int(1) DEFAULT 0,
              is_default int(1) DEFAULT 0,
              permissions text DEFAULT NULL,
              PRIMARY KEY (`id`),
              KEY `jobId` (`jobId`)
            ) ENGINE=InnoDB AUTO_INCREMENT=1;
        ]],
        [[
            INSERT INTO job_grades (jobId, name, salary, owner, is_default, permissions) VALUES
                ('unemployed', 'unemployed', 0, 0, 1, '[]'),
                ('adsl', 'Intérimaire', 0, 0, 1, '[]'),
                ('delivery', 'Intérimaire', 0, 0, 1, '[]'),
                ('religious', 'Intérimaire', 0, 0, 1, '[]'),
                ('scrapper', 'Intérimaire', 0, 0, 1, '[]'),
                ('police', 'Capitaine', 0, 1, 0, '[]'),
                ('police', 'Lieutenant', 0, 0, 0, '[]'),
                ('police', 'Major', 0, 0, 0, '[]'),
                ('police', 'Brigadier', 0, 0, 0, '[]'),
                ('police', 'Cadet', 0, 0, 1, '[]'),
                ('medic', 'Directeur', 0, 1, 0, '[]'),
                ('medic', 'Medecin', 0, 0, 0, '[]'),
                ('medic', 'Infirmier', 0, 0, 1, '[]'),
                ('taxi', 'Patron', 0, 1, 0, '[]'),
                ('taxi', 'Employé', 0, 0, 1, '[]'),
                ('food', 'Patron', 0, 1, 0, '[]'),
                ('food', 'Employé', 0, 0, 1, '[]'),
                ('news', 'Patron', 0, 1, 0, '[]'),
                ('news', 'Employé', 0, 0, 1, '[]'),
                ('garbage', 'Patron', 0, 1, 0, '[]'),
                ('garbage', 'Employé', 0, 0, 1, '[]'),
                ('oil', 'Patron', 0, 1, 0, '[]'),
                ('oil', 'Employé', 0, 0, 1, '[]'),
                ('cash-transfer', 'Patron', 0, 1, 0, '[]'),
                ('cash-transfer', 'Employé', 0, 0, 1, '[]'),
                ('garagist', 'Patron', 0, 1, 0, '[]'),
                ('garagist', 'Employé', 0, 0, 1, '[]')
            ;
        ]],
    },
});
