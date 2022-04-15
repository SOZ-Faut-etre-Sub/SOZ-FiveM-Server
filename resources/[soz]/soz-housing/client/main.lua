QBCore = exports["qb-core"]:GetCoreObject()

Housing = {}

local isOwned = false
local isOwner = false
local isBuilding = false
local coords = {}
LastLocation = nil
IsInside = false

Citizen.CreateThread(function()
    for item, zone in pairs(Config.PolyZone) do
        exports["qb-target"]:AddBoxZone(zone.name, vector3(zone.x, zone.y, zone.z), zone.sx, zone.sy,
                                        {
            name = zone.name,
            heading = zone.heading,
            minZ = zone.minZ,
            maxZ = zone.maxZ,
            debugPoly = false,
        }, {
            options = {
                {
                    label = "Acheter",
                    icon = "c:housing/acheter.png",
                    canInteract = function()
                        TriggerServerEvent("soz-housing:server:isOwned", zone.name)
                        Wait(100)
                        return not isOwned
                    end,
                    action = function()
                        if not isBuilding then
                            TriggerServerEvent("soz-housing:server:ShowAcheter", zone.name)
                        else
                            TriggerServerEvent("soz-housing:server:BuildingShowAcheter", zone.name)
                        end
                    end,
                },
                {
                    label = "Visiter",
                    icon = "c:housing/visiter.png",
                    event = "soz-housing:client:visiter",
                    canInteract = function()
                        if not isBuilding then
                            return not isOwner and isOwned
                        else
                            return not isOwned
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
                            TriggerClientEvent("soz-housing:client:rentrer")
                        else
                            TriggerServerEvent("soz-housing:server:BuildingShowRentrer", zone.name)
                        end
                    end,
                },
                {
                    label = "Garage",
                    icon = "c:housing/garage.png",
                    event = "soz-housing:client:garage",
                    canInteract = function()
                        return isOwner and not isTrailer(zone.name)
                    end,
                },
                {
                    label = "Vendre",
                    icon = "c:housing/vendre.png",
                    event = "soz-housing:client:garage",
                    canInteract = function()
                        return isOwner
                    end,
                    action = function()
                        if not isBuilding then
                            TriggerServerEvent("soz-housing:server:ShowVendre", zone.name)
                        else
                            TriggerServerEvent("soz-housing:server:BuildingShowVendre", zone.name)
                        end
                    end,
                },
            },
            distance = 2.5,
        })
    end
end)

Citizen.CreateThread(function()
    for item, zone in pairs(Config.PolyZone) do
        QBCore.Functions.CreateBlip(zone.name, {
            name = zone.name,
            coords = vector3(zone.x, zone.y, zone.z),
            sprite = 350,
            color = 5,
            scale = 0.5,
        })
    end
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
    player = PlayerPedId()
    LastLocation = GetEntityCoords(player)
    IsInside = true
    SetPedCoordsKeepVehicle(player, coords[1].coordx, coords[1].coordy, coords[1].coordz, coords[1].coordw)
end)

RegisterNetEvent("soz-housing:client:BuildingRentrer")
AddEventHandler("soz-housing:client:BuildingRentrer", function(coordx, coordy, coordz, coordw)
    player = PlayerPedId()
    LastLocation = GetEntityCoords(player)
    IsInside = true
    SetPedCoordsKeepVehicle(player, coordx, coordy, coordz, coordw)
end)

RegisterNetEvent("soz-housing:client:garage")
AddEventHandler("soz-housing:client:garage", function()
    print("test")
end)
