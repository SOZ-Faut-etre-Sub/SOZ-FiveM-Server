table.insert(migrations, {
    name = "add-lsmc-grade",
    queries = {
        [[
            DELETE FROM `job_grades` WHERE jobId='medic';
        ]],
        [[
            INSERT INTO job_grades (jobId, name, salary, owner, is_default, permissions) VALUES
                ('lsmc', 'Directeur', 0, 1, 0, '["society-private-storage"]'),
                ('lsmc', 'Médecin', 0, 0, 0, '[]'),
                ('lsmc', 'Infermier', 0, 0, 1, '[]');
        ]],
    },
});
