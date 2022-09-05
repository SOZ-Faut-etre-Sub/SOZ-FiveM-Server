table.insert(migrations, {
    name = "insert-ffs-grades",
    queries = {
        [[
            INSERT INTO job_grades (jobId, name, weight, salary, owner, is_default, permissions)
            VALUES('ffs', 'Patron', 10, 0, 1, 0, '[]'),
                  ('ffs', 'Employé', 0, 0, 0, 1, '[]');
        ]],
    },
});
