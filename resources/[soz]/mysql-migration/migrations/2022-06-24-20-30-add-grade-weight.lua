table.insert(migrations, {
    name = "add-grade-weight",
    queries = {
        [[
            alter table job_grades add weight int default 0 not null after name;
        ]],
        [[
            update job_grades set weight = 10 where owner = 1;
        ]],
    },
})
