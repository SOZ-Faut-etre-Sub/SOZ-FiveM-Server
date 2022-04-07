local CollectObjects = {
    [GetHashKey("prop_ld_greenscreen_01")] = "n_fix_greenscreen",
    [GetHashKey("prop_tv_cam_02")] = "n_fix_camera",
    [GetHashKey("prop_kino_light_01")] = "n_fix_light",
    [GetHashKey("v_ilev_fos_mic")] = "n_fix_mic",
}
local Objects = {}

RegisterNetEvent("job:server:placeProps", function(item, props, rotation)
    local Player = QBCore.Functions.GetPlayer(source)

    if exports["soz-inventory"]:GetItem(Player.PlayerData.source, item, nil, true) >= 1 then
        exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item, 1)
        TriggerClientEvent("job:client:AddObject", Player.PlayerData.source, GetHashKey(props), rotation)
    end
end)

--- Events
RegisterNetEvent("job:server:AddObject", function(object, position)
    local obj = CreateObjectNoOffset(object, position.x, position.y, position.z, true, true, false)
    SetEntityHeading(obj, position.w or 0)
    FreezeEntityPosition(obj, true)

    Objects[NetworkGetNetworkIdFromEntity(obj)] = position
end)

RegisterNetEvent("job:server:RemoveObject", function(objNet)
    if Objects[objNet] then
        DeleteEntity(NetworkGetEntityFromNetworkId(objNet))
        Objects[objNet] = nil
    end
end)

RegisterNetEvent("job:server:CollectObject", function(objNet)
    local Player = QBCore.Functions.GetPlayer(source)
    local object = NetworkGetEntityFromNetworkId(objNet)
    local item = CollectObjects[GetEntityModel(object)]

    if item then
        if exports["soz-inventory"]:CanCarryItem(Player.PlayerData.source, item, 1) then
            exports["soz-inventory"]:AddItem(Player.PlayerData.source, item, 1)
            TriggerEvent("job:server:RemoveObject", objNet)
        else
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne pouvez pas récupérer cet objet", "error")
        end
    end
end)
