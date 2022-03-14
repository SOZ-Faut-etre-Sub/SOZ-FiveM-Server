table.insert(migrations, {
    name = "update-namebennys",
    queries = {
        [[
            UPDATE job_grades SET jobId = "bennys" WHERE jobId = "garagist";
        ]],
    },
});
