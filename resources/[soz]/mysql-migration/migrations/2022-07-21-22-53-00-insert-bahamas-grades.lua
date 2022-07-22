table.insert(migrations, {
    name = "insert-bahamas-grades",
    queries = {
        [[
            INSERT INTO job_grades (jobId, name, salary, owner, is_default, permissions)
            VALUES('bahamas', 'Patron', 0, 1, 0, '[]'),
                  ('bahamas', 'Employé', 0, 0, 1, '[]');
        ]],
    },
});
