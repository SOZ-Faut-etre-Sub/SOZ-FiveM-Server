table.insert(migrations, {
    name = "insert-upw-grades",
    queries = {
        [[
            INSERT INTO job_grades (jobId, name, salary, owner, is_default, permissions)
            VALUES('upw', 'Patron', 0, 1, 0, '[]'),
                  ('upw', 'Employé', 0, 0, 1, '[]');
        ]],
    },
});
