local dynamicMapMenu, DynamicMapOption = nil, {
    VehicleName = false,
    PlayerName = false,
    BlipsOnMap = false,
    mpTags = {},
    blips = {},
}

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

function DrawText3Ds(x, y, z, text)
    local onScreen, _x, _y = World3dToScreen2d(x, y, z)

    if onScreen then
        SetTextScale(0.35, 0.35)
        SetTextFont(4)
        SetTextProportional(1)
        SetTextColour(255, 255, 255, 215)
        SetTextEntry("STRING")
        SetTextCentre(1)
        AddTextComponentString(text)
        DrawText(_x, _y)
    end
end
local function DisplayVehicleName()
    CreateThread(function()
        while DynamicMapOption.VehicleName do
            local vehicles = GetGamePool("CVehicle")
            for k, vehiclehandle in pairs(vehicles) do
                local dist = GetDistanceBetweenCoords(GetEntityCoords(vehiclehandle), GetEntityCoords(PlayerPedId()), false)
                if dist < 50 then
                    local vehicleCoords = GetEntityCoords(vehiclehandle)
                    local textowner = " | OwnerNet: "
                    if GetPlayerServerId(NetworkGetEntityOwner(vehiclehandle)) == GetPlayerServerId(PlayerId()) then
                        textowner = " | ~g~OwnerNet: "
                    end
                    DrawText3Ds(vehicleCoords.x, vehicleCoords.y, vehicleCoords.z + 1,
                                GetDisplayNameFromVehicleModel(GetEntityModel(vehiclehandle)) .. " | VehiculeNet: " ..
                                    NetworkGetNetworkIdFromEntity(vehiclehandle) .. textowner .. GetPlayerServerId(NetworkGetEntityOwner(vehiclehandle)))
                    DrawText3Ds(vehicleCoords.x, vehicleCoords.y, vehicleCoords.z + 2,
                                "VehiculeEngigneHealth: " .. GetVehicleEngineHealth(vehiclehandle) .. " | VehiculeBodyHealth: " ..
                                    GetVehicleBodyHealth(vehiclehandle) .. " | VehiculeOil: " .. GetVehicleOilLevel(vehiclehandle) .. "/" ..
                                    GetVehicleHandlingFloat(vehiclehandle, "CHandlingData", "fOilVolume"))
                end
            end
            Wait(0)
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

    local confirmowner = dynamicMapMenu:AddConfirm({label = "Afficher l'owner des véhicules", value = nil})

    confirmowner:On("confirm", function()
        DynamicMapOption.VehicleName = true
        DisplayVehicleName()
    end)

    confirmowner:On("deny", function()
        DynamicMapOption.VehicleName = false
    end)

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
