QBCore = exports["qb-core"]:GetCoreObject()

local isOwned = false
local isOwner = false
local LastLocation = nil

Citizen.CreateThread(function()
    for item, zone in pairs(Config.PolyZone) do
        exports["qb-target"]:AddBoxZone(zone.name, vector3(zone.x, zone.y, zone.z), zone.sx, zone.sy, {
            name = zone.name,
            heading = zone.heading,
            minZ = zone.minZ,
            maxZ = zone.maxZ,
            debugPoly = true,
        }, {
            options = {
                {
                    label = "Acheter",
                    icon = "c:housing/acheter.png",
                    event = "soz-housing:client:acheter",
                    canInteract = function()
                        TriggerServerEvent("soz-housing:server:isOwned", zone.name)
                        return isOwned
                    end,
                },                
                {
                    label = "Visiter",
                    icon = "c:housing/visiter.png",
                    event = "soz-housing:client:visiter",
                },                
                {
                    label = "Rentrer",
                    icon = "c:housing/entrer.png",
                    event = "soz-housing:client:rentrer",
                    canInteract = function()
                        return isOwner
                    end,
                },                
                {
                    label = "Garage",
                    icon = "c:housing/garage.png",
                    event = "soz-housing:client:garage",
                    canInteract = function()
                        return isOwner
                    end,
                },
                {
                    label = "Vendre",
                    icon = "c:housing/vendre.png",
                    event = "soz-housing:client:garage",
                    canInteract = function()
                        return isOwner
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
            scale = 0.8,
        })
    end
end)

RegisterNetEvent("soz-housing:client:setOwner")
AddEventHandler("soz-housing:client:setOwner", function(owner)
    isOwner = owner
end)

RegisterNetEvent("soz-housing:client:setOwned")
AddEventHandler("soz-housing:client:setOwned", function(owned)
    isOwned = owned
end)

RegisterNetEvent("soz-housing:client:acheter")
AddEventHandler("soz-housing:client:acheter", function()
    print("test")
end)

RegisterNetEvent("soz-housing:client:visiter")
AddEventHandler("soz-housing:client:visiter", function()
end)

RegisterNetEvent("soz-housing:client:rentrer")
AddEventHandler("soz-housing:client:rentrer", function()
    player = PlayerPedId()
end)

RegisterNetEvent("soz-housing:client:garage")
AddEventHandler("soz-housing:client:garage", function()
    print("test")
end)