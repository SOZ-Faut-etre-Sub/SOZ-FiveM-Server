QBCore = exports["qb-core"]:GetCoreObject()

--- Cuff
RegisterNetEvent("police:server:CuffPlayer", function(targetId, isSoftcuff)
    local Player = QBCore.Functions.GetPlayer(source)
    local Target = QBCore.Functions.GetPlayer(targetId)

    if Target then
        if Player.Functions.GetItemByName("handcuffs") then
            exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "handcuffs", 1)
            Target.Functions.SetMetaData("ishandcuffed", true)

            TriggerClientEvent("police:client:HandCuffAnimation", Player.PlayerData.source)
            TriggerClientEvent("police:client:GetCuffed", Target.PlayerData.source, Player.PlayerData.source, isSoftcuff)
        else
            TriggerClientEvent(Player.PlayerData.source, "~r~Vous n'avez pas de menotte")
        end
    end
end)

RegisterNetEvent("police:server:UnCuffPlayer", function(targetId)
    local Player = QBCore.Functions.GetPlayer(source)
    local Target = QBCore.Functions.GetPlayer(targetId)

    if Target then
        if Player.Functions.GetItemByName("handcuffs_key") then
            exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "handcuffs_key", 1)

            TriggerClientEvent("police:client:UnCuffAnimation", Player.PlayerData.source)
            Wait(3000)

            Target.Functions.SetMetaData("ishandcuffed", false)
            TriggerClientEvent("police:client:GetUnCuffed", Target.PlayerData.source)
        else
            TriggerClientEvent(Player.PlayerData.source, "~r~Vous n'avez pas de clé de menotte")
        end
    end
end)

AddEventHandler("entityCreating", function(handle)
    local entityModel = GetEntityModel(handle)

    if Config.RadarAllowedVehicle[entityModel] then
        Entity(handle).state:set("isSirenMuted", false, true)
    end
end)
