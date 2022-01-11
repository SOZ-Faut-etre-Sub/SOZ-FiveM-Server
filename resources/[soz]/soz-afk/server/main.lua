RegisterServerEvent(
    "afk:server:kick", function()
        DropPlayer(source, "Tu as été AFK trop longtemps...")
    end
)
