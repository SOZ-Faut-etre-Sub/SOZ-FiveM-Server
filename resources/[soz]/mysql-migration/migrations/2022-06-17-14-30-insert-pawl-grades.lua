table.insert(migrations, {
    name = "insert-pawl-grades",
    queries = {
        [[
            INSERT INTO job_grades (jobId, name, salary, owner, is_default, permissions)
            VALUES('pawl', 'Patron', 0, 1, 0, '[]'),
                  ('pawl', 'Employé', 0, 0, 1, '[]');
        ]],
    },
});
