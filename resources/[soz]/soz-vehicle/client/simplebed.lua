local flatbedModel = GetHashKey("flatbed3")

Citizen.CreateThread(function()
    exports["qb-target"]:AddGlobalVehicle({
        options = {
            {
                label = "Attacher",
                color = "bennys",
                icon = "c:mechanic/Attacher.png",
                event = "vehicle:flatbed:attach",
                canInteract = function(entity)
                    return GetEntityModel(entity) ~= flatbedModel and Entity(entity).state.towedVehicle == nil
                end,
            },
            {
                label = "Détacher",
                color = "bennys",
                icon = "c:mechanic/Detacher.png",
                event = "vehicle:flatbed:detach",
                canInteract = function(entity)
                    return GetEntityModel(entity) == flatbedModel and Entity(entity).state.towedVehicle ~= nil
                end,
            },
        },
        distance = 3.0,
    })
end)

RegisterNetEvent("vehicle:flatbed:attach", function(data)
    local flatbed = GetLastDrivenVehicle()

    if GetEntityModel(data.entity) == flatbedModel then
        exports["soz-hud"]:DrawNotification("Vous ne pouvez pas attacher un flatbed à un autre flatbed.", "error")
        return
    end

    if IsPedInAnyVehicle(PlayerPedId(), true) then
        exports["soz-hud"]:DrawNotification("Vous ne devez pas être dans un véhicule.", "error")
        return
    end

    if GetEntityModel(flatbed) ~= flatbedModel then
        exports["soz-hud"]:DrawNotification("Vous devez être monté dans un flatbed avant.", "error")
        return
    end

    if Entity(flatbed).state.towedVehicle ~= nil then
        exports["soz-hud"]:DrawNotification("Ce flatbed a déjà un véhicule attaché.", "error")
        return
    end

    while not NetworkHasControlOfEntity(flatbed) do
        NetworkRequestControlOfEntity(flatbed)
        Citizen.Wait(0)
    end

    while not NetworkHasControlOfEntity(data.entity) do
        NetworkRequestControlOfEntity(data.entity)
        Citizen.Wait(0)
    end

    AttachEntityToEntity(data.entity, flatbed, 20, 1.0, 2.5, 1.0, 0.0, 0.0, 0.0, false, false, true, false, 20, true)
    Entity(flatbed).state.towedVehicle = VehToNet(data.entity)

    exports["soz-hud"]:DrawNotification("Véhicule attaché.")
end)

RegisterNetEvent("vehicle:flatbed:detach", function(data)
    local flatbed = data.entity
    local towedVehicle = NetToVeh(Entity(flatbed).state.towedVehicle)

    if IsPedInAnyVehicle(PlayerPedId(), true) then
        exports["soz-hud"]:DrawNotification("Vous ne devez pas être dans un véhicule.", "error")
        return
    end

    if GetEntityModel(flatbed) ~= flatbedModel then
        exports["soz-hud"]:DrawNotification("Vous devez être monté dans un flatbed avant.", "error")
        return
    end

    if Entity(flatbed).state.towedVehicle == nil then
        exports["soz-hud"]:DrawNotification("Ce flatbed n'a pas de véhicule attaché.", "error")
        return
    end

    while not NetworkHasControlOfEntity(flatbed) do
        NetworkRequestControlOfEntity(flatbed)
        Citizen.Wait(0)
    end

    while not NetworkHasControlOfEntity(towedVehicle) do
        NetworkRequestControlOfEntity(towedVehicle)
        Citizen.Wait(0)
    end

    AttachEntityToEntity(towedVehicle, flatbed, 20, 1.0, -7.0, 1.0, 0.0, 0.0, 0.0, false, false, false, false, 20, true)
    DetachEntity(towedVehicle, true, true)

    Entity(flatbed).state.towedVehicle = nil

    exports["soz-hud"]:DrawNotification("Véhicule détaché.")
end)
