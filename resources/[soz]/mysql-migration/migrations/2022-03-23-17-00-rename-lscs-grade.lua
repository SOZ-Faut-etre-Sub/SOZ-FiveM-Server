table.insert(migrations, {
    name = "rename-lscs-grade",
    queries = {
        [[
            UPDATE `job_grades` SET jobId='bcso' WHERE jobId='lscs';
        ]],
    },
});
