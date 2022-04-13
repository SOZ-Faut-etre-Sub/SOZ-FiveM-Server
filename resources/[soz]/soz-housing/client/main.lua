QBCore = exports["qb-core"]:GetCoreObject()

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
                    label = "Acheter une habitation",
                    icon = "fas fa-door-closed",
                    event = "soz-housing:client:acheter",
                },                
                {
                    label = "Visiter une habitation",
                    icon = "fas fa-door-closed",
                    event = "soz-housing:client:visiter",
                },                
                {
                    label = "Rentrer dans une habitation",
                    icon = "fas fa-door-closed",
                    event = "soz-housing:client:rentrer",
                },                
                {
                    label = "Ouvrir son Garage",
                    icon = "fas fa-garage",
                    event = "soz-housing:client:garage",
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

RegisterNetEvent("soz-housing:client:acheter")
AddEventHandler("soz-housing:client:acheter", function()
    print("test")
end)

RegisterNetEvent("soz-housing:client:visiter")
AddEventHandler("soz-housing:client:visiter", function()
    print("test")
end)

RegisterNetEvent("soz-housing:client:rentrer")
AddEventHandler("soz-housing:client:rentrer", function()
    player = PlayerPedId()
    SetPedCoordsKeepVehicle(player, )
end)

RegisterNetEvent("soz-housing:client:garage")
AddEventHandler("soz-housing:client:garage", function()
    print("test")
end)