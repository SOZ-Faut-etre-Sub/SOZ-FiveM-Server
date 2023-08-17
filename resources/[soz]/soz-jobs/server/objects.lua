local CollectObjects = {
    [GetHashKey("prop_ld_greenscreen_01")] = "n_fix_greenscreen",
    [GetHashKey("prop_tv_cam_02")] = "n_fix_camera",
    [GetHashKey("prop_kino_light_01")] = "n_fix_light",
    [GetHashKey("v_ilev_fos_mic")] = "n_fix_mic",
}

RegisterNetEvent("job:server:placeProps", function(item, props, rotation, offset)
    local Player = QBCore.Functions.GetPlayer(source)

    if exports["soz-inventory"]:GetItem(Player.PlayerData.source, item, nil, true) >= 1 then
        exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item, 1)
        TriggerClientEvent("job:client:AddObject", Player.PlayerData.source, GetHashKey(props), rotation, offset)
    else
        TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Vous ne possédez pas cet objet.", "error")
    end
end)

--- Events
RegisterNetEvent("job:server:AddObject", function(object, position)
    exports["soz-core"]:CreateObject({model = object, position = {position.x, position.y, position.z, position.w or 0}})
end)

RegisterNetEvent("job:server:RemoveObject", function(id)
    exports["soz-core"]:DeleteObject(id)
end)

RegisterNetEvent("job:server:CollectObject", function(id, model)
    local Player = QBCore.Functions.GetPlayer(source)
    local item = CollectObjects[model]

    if item then
        if exports["soz-inventory"]:CanCarryItem(Player.PlayerData.source, item, 1) then
            exports["soz-inventory"]:AddItem(Player.PlayerData.source, Player.PlayerData.source, item, 1)
            exports["soz-core"]:DeleteObject(id)
        else
            TriggerClientEvent("soz-core:client:notification:draw", Player.PlayerData.source, "Vous ne pouvez pas récupérer cet objet", "error")
        end
    end
end)
