local playersMenu = MenuV:InheritMenu(AdminMenu, {subtitle = "Michel ? c'est toi ?"})
local playerMenu = MenuV:InheritMenu(playersMenu)

local CurrentPlayerData = {}

--- Menu entries
playersMenu:On("open", function(menu)
    menu:ClearItems()

    QBCore.Functions.TriggerCallback("admin:server:getplayers", function(players)
        for _, v in pairs(players) do
            menu:AddButton({
                label = ("[%s] %s"):format(v.id, v.name),
                value = playerMenu,
                select = function()
                    CurrentPlayerData = v
                end,
            })
        end
    end)
end)

playersMenu:On("close", function(menu)
    menu:ClearItems()
end)

playerMenu:AddButton({
    label = "Observer le joueur",
    value = nil,
    select = function()
        TriggerServerEvent("admin:server:spectate", CurrentPlayerData)
    end,
})

playerMenu:AddSlider({
    label = "Santé du joueur",
    value = "heal",
    values = {{label = "Tuer", value = "kill"}, {label = "Réanimer", value = "revive"}},
    select = function(_, value)
        TriggerServerEvent("admin:server:" .. value, CurrentPlayerData)
    end,
})

playerMenu:AddSlider({
    label = "Mouvement du joueur",
    value = "freeze",
    values = {{label = "Bloquer", value = "freeze"}, {label = "Débloquer", value = "unfreeze"}},
    select = function(_, value)
        TriggerServerEvent("admin:server:" .. value, CurrentPlayerData)
    end,
})

playerMenu:AddSlider({
    label = "Téléportation",
    value = "pos",
    values = {{label = "vers le joueur", value = "goto"}, {label = "à moi", value = "bring"}},
    select = function(_, value)
        TriggerServerEvent("admin:server:" .. value, CurrentPlayerData)
    end,
})

--- Add to main menu
AdminMenu:AddButton({icon = "👨‍💻‍", label = "Gestion des joueurs", value = playersMenu})
