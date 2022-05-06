local playersMenu, playerMenu
local CurrentPlayerData = {}

function AdminMenuPlayers(menu, permission)
    if playersMenu == nil then
        playersMenu = MenuV:InheritMenu(menu, {subtitle = "Michel ? c'est toi ?"})
    end
    if playerMenu == nil then
        playerMenu = MenuV:InheritMenu(playersMenu)
    end

    playersMenu:ClearItems()
    playerMenu:ClearItems()

    playersMenu:On("open", function(m)
        m:ClearItems()

        QBCore.Functions.TriggerCallback("admin:server:getplayers", function(players)
            for _, v in pairs(players) do
                m:AddButton({
                    label = ("[%s] %s"):format(v.id, v.name),
                    value = playerMenu,
                    select = function()
                        CurrentPlayerData = v
                    end,
                })
            end
        end)
    end)

    playersMenu:On("close", function(m)
        m:ClearItems()
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
end
