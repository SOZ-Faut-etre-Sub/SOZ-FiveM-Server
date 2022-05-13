table.insert(migrations, {
    name = "add-fbi-grade",
    queries = {
        [[
            INSERT INTO job_grades (jobId, name, salary, owner, is_default, permissions) VALUES
                ('fbi', 'Agent', 0, 1, 1, '[]');
        ]],
    },
});
