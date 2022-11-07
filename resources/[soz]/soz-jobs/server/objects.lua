local CollectObjects = {
    [GetHashKey("prop_ld_greenscreen_01")] = "n_fix_greenscreen",
    [GetHashKey("prop_tv_cam_02")] = "n_fix_camera",
    [GetHashKey("prop_kino_light_01")] = "n_fix_light",
    [GetHashKey("v_ilev_fos_mic")] = "n_fix_mic",
}
local ObjectWithoutFreeze = {[GetHashKey("prop_cardbordbox_03a")] = true}

RegisterNetEvent("job:server:placeProps", function(item, props, rotation, offset)
    local Player = QBCore.Functions.GetPlayer(source)

    if exports["soz-inventory"]:GetItem(Player.PlayerData.source, item, nil, true) >= 1 then
        exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item, 1)
        TriggerClientEvent("job:client:AddObject", Player.PlayerData.source, GetHashKey(props), rotation, offset)
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne possèder pas cette objet.", "error")
    end
end)

--- Events
RegisterNetEvent("job:server:AddObject", function(object, position)
    exports["soz-utils"]:CreateObject(object, position.x, position.y, position.z, position.w or 0, 8000.0, ObjectWithoutFreeze[object] ~= true)
end)

RegisterNetEvent("job:server:RemoveObject", function(ref)
    exports["soz-utils"]:DeleteObject(ref)
end)

RegisterNetEvent("job:server:CollectObject", function(ref, model)
    local Player = QBCore.Functions.GetPlayer(source)
    local item = CollectObjects[model]

    if item then
        if exports["soz-inventory"]:CanCarryItem(Player.PlayerData.source, item, 1) then
            exports["soz-inventory"]:AddItem(Player.PlayerData.source, item, 1)
            TriggerEvent("job:server:RemoveObject", ref)
        else
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne pouvez pas récupérer cet objet", "error")
        end
    end
end)
