table.insert(migrations, {
    name = "update-bb-salary",
    queries = {
        [[
            UPDATE job_grades SET salary = 146 WHERE id = 20;
        ]],
        [[
            UPDATE job_grades SET salary = 123 WHERE id = 64;
        ]],
        [[
            UPDATE job_grades SET salary = 101 WHERE id = 63;
        ]],
        [[
            UPDATE job_grades SET salary = 78 WHERE id = 21;
        ]],
        [[
            UPDATE job_grades SET salary = 56 WHERE id = 62;
        ]],
    },
});
