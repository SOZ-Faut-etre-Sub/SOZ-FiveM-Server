local flatbedModel = GetHashKey("flatbed3")

Citizen.CreateThread(function()
    exports["qb-target"]:AddGlobalVehicle({
        options = {
            {
                color = "bennys",
                label = "Remorquer",
                icon = "c:mechanic/Mettre.png",
                event = "vehicle:flatbed:attach",
                canInteract = function(entity)
                    return GetEntityModel(entity) ~= flatbedModel and Entity(entity).state.towedVehicle == nil and Entity(GetLastDrivenVehicle()).state.towedVehicle == nil
                end,
                job = "bennys",
            },
            {
                color = "bennys",
                label = "Démorquer",
                icon = "c:mechanic/Retirer.png",
                event = "vehicle:flatbed:detach",
                canInteract = function(entity)
                    return GetEntityModel(entity) == flatbedModel and Entity(entity).state.towedVehicle ~= nil
                end,
                job = "bennys",
            },
        },
        distance = 3.0,
    })
end)

RegisterNetEvent("vehicle:flatbed:attach", function(data)
    local flatbed = GetLastDrivenVehicle()

    if data.entity == flatbed then
        exports["soz-hud"]:DrawNotification("Vous ne pouvez pas vous attacher à vous-même.")
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

    AttachEntityToEntity(data.entity, flatbed, GetEntityBoneIndexByName(flatbed, "scoop"), 0.0, 0.5, 20.5, 0.0, 0.0, 0.0, false, false, true, false, 20, true)
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

    AttachEntityToEntity(towedVehicle, flatbed, GetEntityBoneIndexByName(flatbed, "scoop"), 0.0, -8.0, 20.0, 0.0, 0.0, 0.0, false, false, false, false, 20, true)
    DetachEntity(towedVehicle, true, true)

    Entity(flatbed).state.towedVehicle = nil

    exports["soz-hud"]:DrawNotification("Véhicule détaché.")
end)
