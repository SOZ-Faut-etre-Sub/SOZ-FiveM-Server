local playersMenu, playerMenu, featureMenu
local CurrentPlayerData = {}

local function CreateFeatureMenu(player)
end

function AdminMenuPlayers(menu, permission)
    if playersMenu == nil then
        playersMenu = MenuV:InheritMenu(menu, {subtitle = "Michel ? c'est toi ?"})
    end
    if playerMenu == nil then
        playerMenu = MenuV:InheritMenu(playersMenu)
    end

    if featureMenu == nil then
        featureMenu = MenuV:InheritMenu(playerMenu)
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

    if permission ~= "helper" then
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
            label = "Vocal en jeu",
            value = "",
            values = {
                {label = "Status", value = "status"},
                {label = "Muter", value = "mute"},
                {label = "Démuter", value = "unmute"},
            },
            select = function(_, value)
                if value == "status" then
                    local playerIsMuted = QBCore.Functions.TriggerRpc("voip:server:player:isMuted", CurrentPlayerData.id)

                    if playerIsMuted then
                        exports["soz-hud"]:DrawNotification("Le joueur est ~r~muté", "info")
                    else
                        exports["soz-hud"]:DrawNotification("Le joueur ~g~n'est pas muté", "info")
                    end
                elseif value == "mute" then
                    TriggerServerEvent("voip:server:player:mute", true, CurrentPlayerData.id)
                elseif value == "unmute" then
                    TriggerServerEvent("voip:server:player:mute", false, CurrentPlayerData.id)
                end
            end,
        })
    end

    playerMenu:AddSlider({
        label = "Téléportation",
        value = "pos",
        values = {{label = "vers le joueur", value = "goto"}, {label = "à moi", value = "bring"}},
        select = function(_, value)
            TriggerServerEvent("admin:server:" .. value, CurrentPlayerData)
        end,
    })

    if permission ~= "helper" then
        playerMenu:AddSlider({
            label = "Effet",
            value = "pos",
            values = {
                {label = "Alcolique", value = "alcohol"},
                {label = "Drogué", value = "drug"},
                {label = "Normal", value = "normal"},
            },
            select = function(_, value)
                TriggerServerEvent("admin:server:effect:" .. value, CurrentPlayerData.id)
            end,
        })

        playerMenu:AddSlider({
            label = "Rendre malade",
            value = "maladie",
            values = {
                {label = "Rhume", value = "rhume"},
                {label = "Grippe", value = "grippe"},
                {label = "Intoxication", value = "intoxication"},
                {label = "Rougeur", value = "rougeur"},
                {label = "Mal au dos", value = "backpain"},
                {label = "Soigner", value = false},
            },
            select = function(_, value)
                TriggerServerEvent("lsmc:maladie:server:SetCurrentDisease", value, CurrentPlayerData.id)
            end,
        })

        playerMenu:AddButton({
            label = "Reset le skin joueur",
            value = nil,
            select = function()
                TriggerServerEvent("admin:server:reset-skin", CurrentPlayerData)
            end,
        })

        featureMenu:On("open", function()
            local playerFeatures = QBCore.Functions.TriggerRpc("soz-admin:feature:GetFeatures", CurrentPlayerData.id)
            featureMenu:ClearItems()

            for featureId, featureLabel in pairs(Config.Features) do
                local label = "Feature : " .. featureLabel
                local value = "n"

                for _, playerFeature in pairs(playerFeatures or {}) do
                    if playerFeature == featureId then
                        value = "y"
                        break
                    end
                end

                local featureConfirm = featureMenu:AddConfirm({
                    label = label,
                    description = "Activer / Désactiver la feature ?",
                    value = value,
                });

                featureConfirm:On("confirm", function()
                    TriggerServerEvent("soz-admin:feature:AddFeature", CurrentPlayerData.id, featureId)
                end)

                featureConfirm:On("deny", function()
                    TriggerServerEvent("soz-admin:feature:RemoveFeature", CurrentPlayerData.id, featureId)
                end)
            end
        end)

        playerMenu:AddButton({label = "Gérer les features", value = featureMenu})
    end

    featureMenu:On("close", function()
        featureMenu:ClearItems()
    end)

    --- Add to main menu
    AdminMenu:AddButton({icon = "👨‍💻‍", label = "Gestion des joueurs", value = playersMenu})
end

