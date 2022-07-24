table.insert(migrations, {
    name = "insert-baun-grades",
    queries = {
        [[
            INSERT INTO job_grades (jobId, name, salary, owner, is_default, permissions)
            VALUES('baun', 'Patron', 0, 1, 0, '[]'),
                  ('baun', 'Employé', 0, 0, 1, '[]');
        ]],
    },
});
