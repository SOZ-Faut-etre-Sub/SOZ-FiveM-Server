table.insert(migrations, {
    name = "phone-update-messages-conversations-table",
    queries = {
        [[
            alter table phone_messages_conversations drop column unreadCount;
        ]],
        [[
            alter table phone_messages_conversations alter column unread set default 0;
        ]],
        [[
            update phone_messages_conversations set unread = 0;
        ]],
    },
})
