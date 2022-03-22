local dynamicMapMenu = MenuV:InheritMenu(AdminMenu, {subtitle = "Des options à la carte"})

local DynamicMapOption = {PlayerName = false, BlipsOnMap = false, mpTags = {}, blips = {}}

--- Functions
local function DisplayPlayerName()
    CreateThread(function()
        while DynamicMapOption.PlayerName do
            QBCore.Functions.TriggerCallback("admin:server:getplayers", function(players)
                for _, player in pairs(players) do
                    DynamicMapOption.mpTags[player.citizenid] = CreateMpGamerTagForNetPlayer(GetPlayerFromServerId(player.sourceplayer), player.name, false,
                                                                                             false, "", 0, 0, 0, 0)

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

                    QBCore.Functions.CreateBlip(DynamicMapOption.blips[player.citizenid], {
                        coords = player.coords,
                        name = player.name,
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

--- Menu entries
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
AdminMenu:AddButton({icon = "🗺", label = "Informations interactive", value = dynamicMapMenu})
