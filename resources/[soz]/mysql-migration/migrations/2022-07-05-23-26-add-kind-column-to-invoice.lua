table.insert(migrations, {
    name = "add-kind-column-to-invoice",
    queries = {
        [[
            ALTER TABLE invoices add kind varchar(50) default 'invoice' after payed;
        ]],
    },
})
