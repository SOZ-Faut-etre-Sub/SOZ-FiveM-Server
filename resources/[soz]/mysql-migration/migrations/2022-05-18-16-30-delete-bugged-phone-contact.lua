table.insert(migrations, {
    name = "delete-bugged-phone-contact",
    queries = {
        [[
            delete from phone_contacts where LENGTH(number) < 8;
        ]],
        [[
            delete from phone_messages where LENGTH(conversation_id) < 17;
        ]],
        [[
            delete from phone_messages_conversations where LENGTH(conversation_id) < 17;
        ]],
    },
});
