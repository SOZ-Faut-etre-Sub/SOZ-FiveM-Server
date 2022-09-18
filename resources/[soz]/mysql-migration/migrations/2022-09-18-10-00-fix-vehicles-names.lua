table.insert(migrations, {
    name = "fix-vehicles-names",
    queries = [[
        UPDATE vehicles SET name = 'Oracle' where model = 'oracle2';
        UPDATE vehicles SET name = 'Oracle XS' where model = 'oracle';
        UPDATE vehicles SET name = 'Dubsta Luxury' where model = 'dubsta2';
    ]]
})
