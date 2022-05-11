local dynamicMapMenu, DynamicMapOption = nil, {PlayerName = false, BlipsOnMap = false, mpTags = {}, blips = {}}

--- Functions
local function DisplayPlayerName()
    CreateThread(function()
        while DynamicMapOption.PlayerName do
            QBCore.Functions.TriggerCallback("admin:server:getplayers", function(players)
                for _, player in pairs(players) do
                    DynamicMapOption.mpTags[player.citizenid] = GetPlayerFromServerId(player.sourceplayer)
                    CreateMpGamerTagWithCrewColor(DynamicMapOption.mpTags[player.citizenid], player.name, false, false, "", 0, 0, 0, 0)
                    SetMpGamerTagVisibility(DynamicMapOption.mpTags[player.citizenid], 0, true)
                end
            end)

            Wait(5000)

            for _, v in pairs(DynamicMapOption.mpTags) do
                RemoveMpGamerTag(v)
            end
        end
    end)
end

local function DisplayPlayerBlip()
    CreateThread(function()
        while DynamicMapOption.BlipsOnMap do
            QBCore.Functions.TriggerCallback("admin:server:getplayers", function(players)
                for _, player in pairs(players) do
                    DynamicMapOption.blips[player.citizenid] = "admin:playerblip:" .. player.citizenid

                    QBCore.Functions.CreateBlip(DynamicMapOption.blips[player.citizenid],
                                                {
                        coords = player.coords,
                        heading = player.heading,
                        name = player.name,
                        showheading = true,
                        sprite = 1,
                    })
                end
            end)

            Wait(2500)

            for _, blip in pairs(DynamicMapOption.blips) do
                QBCore.Functions.RemoveBlip(blip)
            end
        end
    end)
end

function AdminMenuDynamicMap(menu, permission)
    if dynamicMapMenu == nil then
        dynamicMapMenu = MenuV:InheritMenu(menu, {subtitle = "Des options à la carte"})
    end

    dynamicMapMenu:ClearItems()

    dynamicMapMenu:AddCheckbox({
        label = "Afficher le nom des joueurs",
        value = nil,
        change = function(_, checked)
            DynamicMapOption.PlayerName = checked
            DisplayPlayerName()
        end,
    })

    dynamicMapMenu:AddCheckbox({
        label = "Afficher les joueurs sur la carte",
        value = nil,
        change = function(_, checked)
            DynamicMapOption.BlipsOnMap = checked
            DisplayPlayerBlip()
        end,
    })

    --- Add to main menu
    menu:AddButton({icon = "🗺", label = "Informations interactive", value = dynamicMapMenu})
end
