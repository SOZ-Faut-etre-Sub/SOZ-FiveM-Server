QBCore = exports["qb-core"]:GetCoreObject()

exports["qb-target"]:AddBoxZone("zkea", vector3(2748.86, 3472.53, 55.71), 1, 1, {
    name = "zkea",
    heading = 0,
    debugPoly = false,
    minZ = 54.51,
    maxZ = 56.51,
}, {
    options = {{type = "client", event = "zkea:client:shop", icon = "c:magasin:acheter.png", label = "Magasin"}},
    distance = 2.5,
})

RegisterNetEvent("zkea:client:shop")
AddEventHandler("zkea:client:shop", function()
    Housing.Functions.Menu.zkea()
end)

RegisterNetEvent("zkea:client:setmap")
AddEventHandler("zkea:client:setmap", function(val)
    local exist = false
    if val and not exist then
        exist = true
        for item, zone in pairs(Config.PolyZone) do
            QBCore.Functions.CreateBlip(zone.name, {
                name = "Habitation",
                coords = vector3(zone.x, zone.y, zone.z),
                sprite = 350,
                color = 5,
                scale = 0.5,
            })
        end
    end
    if not val then
        for item, zone in pairs(Config.PolyZone) do
            if DoesBlipExist(zone.name) then
                RemoveBlip(zone.name)
            end
        end
        exist = false
    end
end)
