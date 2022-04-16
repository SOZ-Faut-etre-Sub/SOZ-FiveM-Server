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

TriggerServerEvent("soz-housing:server:SetZone")

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
                                    TriggerEvent("soz-housing:client:rentrer")
                                else
                                    TriggerServerEvent("soz-housing:server:BuildingShowRentrer", name)
                                end
                            end,
                        },
                        {
                            label = "Garage",
                            icon = "c:housing/garage.png",
                            event = "soz-housing:client:garage",
                            canInteract = function()
                                return isOwner and not isTrailer(name)
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
                                    TriggerServerEvent("soz-housing:server:ShowVendre", zone.identifier)
                                else
                                    TriggerServerEvent("soz-housing:server:BuildingShowVendre", zone.identifier)
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

RegisterNetEvent("soz-housing:client:SetBlip")
AddEventHandler("soz-housing:client:SetBlip", function(GlobalZone)
    Citizen.CreateThread(function()
        for item, zone in pairs(Config.PolyZone) do
            QBCore.Functions.CreateBlip(zone.identifier, {
                name = "Habitation",
                coords = vector3(zone.x, zone.y, zone.z),
                sprite = 350,
                color = 5,
                scale = 0.5,
            })
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
    player = PlayerPedId()
    LastLocation = GetEntityCoords(player)
    IsInside = true
    print(dump(coords))
    for item, Coord in pairs(coords) do
        local point = json.decode(Coord.teleport)
        SetPedCoordsKeepVehicle(player, point.x, point.y, point.z, point.w)
    end
end)

RegisterNetEvent("soz-housing:client:BuildingRentrer")
AddEventHandler("soz-housing:client:BuildingRentrer", function(point)
    player = PlayerPedId()
    LastLocation = GetEntityCoords(player)
    IsInside = true
    SetPedCoordsKeepVehicle(player, point.x, point.y, point.z, point.w)
end)

RegisterNetEvent("soz-housing:client:garage")
AddEventHandler("soz-housing:client:garage", function()
    print("test")
end)
