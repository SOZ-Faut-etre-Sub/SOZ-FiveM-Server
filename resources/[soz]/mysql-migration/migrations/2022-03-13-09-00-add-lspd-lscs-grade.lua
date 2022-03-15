table.insert(migrations, {
    name = "add-lspd-lscs-grade",
    queries = {
        [[
            DELETE FROM `job_grades` WHERE jobId='police';
        ]],
        [[
            INSERT INTO job_grades (jobId, name, salary, owner, is_default, permissions) VALUES
                ('lspd', 'Commissaire', 0, 1, 0, '[]'),
                ('lspd', 'Capitaine', 0, 0, 0, '["society-private-storage"]'),
                ('lspd', 'Lieutenant', 0, 0, 0, '[]'),
                ('lspd', 'Sergent-Chef', 0, 0, 0, '[]'),
                ('lspd', 'Sergent', 0, 0, 0, '[]'),
                ('lspd', 'Officier Supérieur', 0, 0, 0, '[]'),
                ('lspd', 'Officier', 0, 0, 0, '[]'),
                ('lspd', 'Cadet', 0, 0, 1, '[]');
        ]],
        [[
            INSERT INTO job_grades (jobId, name, salary, owner, is_default, permissions) VALUES
                ('lscs', 'Sheriff', 0, 1, 0, '[]'),
                ('lscs', 'Adjoint', 0, 0, 0, '["society-private-storage"]'),
                ('lscs', 'Chef de Division', 0, 0, 0, '[]'),
                ('lscs', 'Deputy-Chief', 0, 0, 0, '[]'),
                ('lscs', 'Deputy', 0, 0, 0, '[]'),
                ('lscs', 'Recrue', 0, 0, 1, '[]');
        ]],
    },
});
