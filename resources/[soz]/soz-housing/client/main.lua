QBCore = exports["qb-core"]:GetCoreObject()

Housing = {}

local isOwned = false
local isOwner = false
local isBuilding = false
local coords = {}
LastLocation = nil
IsInside = false

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    TriggerServerEvent("soz-housing:server:SetZone")
end)

RegisterNetEvent("soz-housing:client:SetEntry")
AddEventHandler("soz-housing:client:SetEntry", function(GlobalZone)
    Citizen.CreateThread(function()
        for item, zone in pairs(GlobalZone) do
            local name = nil
            if zone.building == nil then
                name = zone.identifier
            else
                name = zone.building
            end
            if zone.entry_zone ~= nil then
                local entry = json.decode(zone.entry_zone)
                exports["qb-target"]:AddBoxZone(name, vector3(entry["x"], entry["y"], entry["z"]), entry["sx"], entry["sy"],
                                                {
                    name = name,
                    heading = entry["heading"],
                    minZ = entry["minZ"],
                    maxZ = entry["maxZ"],
                    debugPoly = false,
                }, {
                    options = {
                        {
                            label = "Acheter",
                            icon = "c:housing/acheter.png",
                            canInteract = function()
                                TriggerServerEvent("soz-housing:server:isOwned", name)
                                Wait(100)
                                return not isOwned
                            end,
                            action = function()
                                if not isBuilding then
                                    TriggerServerEvent("soz-housing:server:ShowAcheter", name)
                                else
                                    TriggerServerEvent("soz-housing:server:BuildingShowAcheter", name)
                                end
                            end,
                        },
                        {
                            label = "Rentrer",
                            icon = "c:housing/entrer.png",
                            event = "soz-housing:client:rentrer",
                            canInteract = function()
                                return isOwner
                            end,
                            action = function()
                                if not isBuilding then
                                    TriggerEvent("soz-housing:client:rentrer")
                                else
                                    TriggerServerEvent("soz-housing:server:BuildingShowRentrer", name)
                                end
                            end,
                        },
                        {
                            label = "Garage",
                            icon = "c:housing/garage.png",
                            canInteract = function()
                                return isOwner and not isTrailer(name)
                            end,
                            action = function()
                                TriggerEvent("soz-housing:client:garage", zone.identifier)
                            end,
                        },
                        {
                            label = "Vendre",
                            icon = "c:housing/vendre.png",
                            canInteract = function()
                                return isOwner
                            end,
                            action = function()
                                if not isBuilding then
                                    TriggerServerEvent("soz-housing:server:ShowVendre", name)
                                else
                                    TriggerServerEvent("soz-housing:server:BuildingShowVendre", name)
                                end
                            end,
                        },
                    },
                    distance = 2.5,
                })
            end
        end
    end)
end)

function isTrailer(name)
    if string.find(name, "trailer") == nil then
        return false
    else
        return true
    end
end

RegisterNetEvent("soz-housing:client:setData")
AddEventHandler("soz-housing:client:setData", function(owner, owned, building, coord)
    isOwner = owner
    isOwned = owned
    isBuilding = building
    coords = coord
end)

RegisterNetEvent("soz-housing:client:Acheter")
AddEventHandler("soz-housing:client:Acheter", function(Data)
    Housing.Functions.Menu.BuyHousing(Data)
end)

RegisterNetEvent("soz-housing:client:Vendre")
AddEventHandler("soz-housing:client:Vendre", function(Data)
    Housing.Functions.Menu.SellHousing(Data)
end)

RegisterNetEvent("soz-housing:client:Rentrer")
AddEventHandler("soz-housing:client:Rentrer", function(Data)
    Housing.Functions.Menu.ShowRentrer(Data)
end)

RegisterNetEvent("soz-housing:client:visiter")
AddEventHandler("soz-housing:client:visiter", function()
end)

RegisterNetEvent("soz-housing:client:rentrer")
AddEventHandler("soz-housing:client:rentrer", function()
    LastLocation = GetEntityCoords(PlayerPedId())
    IsInside = true
    for item, Coord in pairs(coords) do
        local point = json.decode(Coord.teleport)
        QBCore.Functions.Progressbar("house_enter", "Ouvre la porte", 1000, false, true,
                                     {
            disableMovement = true,
            disableCarMovement = true,
            disableMouse = false,
            disableCombat = true,
        }, {animDict = "anim@narcotics@trash", anim = "drop_front", flags = 16}, {}, {}, function() -- Done
            SetPedCoordsKeepVehicle(PlayerPedId(), point.x, point.y, point.z, point.w)
        end, function() -- Cancel
        end)
    end
end)

RegisterNetEvent("soz-housing:client:BuildingRentrer")
AddEventHandler("soz-housing:client:BuildingRentrer", function(point)
    LastLocation = GetEntityCoords(PlayerPedId())
    IsInside = true
    QBCore.Functions.Progressbar("Building_enter", "Tape le code", 1000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@narcotics@trash", anim = "drop_front", flags = 16}, {}, {}, function() -- Done
        SetPedCoordsKeepVehicle(PlayerPedId(), point.x, point.y, point.z, point.w)
    end, function() -- Cancel
    end)
end)

RegisterNetEvent("soz-housing:client:garage")
AddEventHandler("soz-housing:client:garage", function(identifier)
    TriggerEvent("soz-garage:client:Menu", "housing", {}, identifier)
end)
