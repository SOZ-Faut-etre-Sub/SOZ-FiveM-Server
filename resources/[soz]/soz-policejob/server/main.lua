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

RegisterNetEvent("police:server:EscortPlayer", function(playerId)
    local player = QBCore.Functions.GetPlayer(source)
    local target = QBCore.Functions.GetPlayer(playerId)

    if player and target and player ~= target then
        for _, allowedJob in ipairs(Config.AllowedJobInteraction) do
            if player.PlayerData.job.id == allowedJob then
                if target.PlayerData.metadata["ishandcuffed"] or target.PlayerData.metadata["isdead"] or target.PlayerData.metadata["inlaststand"] then
                    Player(player.PlayerData.source).state:set("isEscorting", true, true)
                    Player(player.PlayerData.source).state:set("escorting", target.PlayerData.source, true)
                    Player(target.PlayerData.source).state:set("isEscorted", true, true)

                    TriggerClientEvent("police:client:GetEscorted", target.PlayerData.source, player.PlayerData.source)

                    return
                end
            end
        end
    end
end)

RegisterNetEvent("police:server:DeEscortPlayer", function(playerId)
    local player = QBCore.Functions.GetPlayer(source)
    local target = QBCore.Functions.GetPlayer(playerId)

    local playerState = Player(player.PlayerData.source).state
    local targetState = Player(target.PlayerData.source).state

    if player and target and player ~= target then
        for _, allowedJob in ipairs(Config.AllowedJobInteraction) do
            if player.PlayerData.job.id == allowedJob then
                print(playerState.isEscorting, playerState.escorting == target.PlayerData.source, targetState.isEscorted)
                if playerState.isEscorting and playerState.escorting == target.PlayerData.source and targetState.isEscorted then
                    Player(player.PlayerData.source).state:set("isEscorting", false, true)
                    Player(player.PlayerData.source).state:set("escorting", nil, true)
                    Player(target.PlayerData.source).state:set("isEscorted", false, true)

                    TriggerClientEvent("police:client:DeEscort", target.PlayerData.source)

                    return
                end
            end
        end
    end
end)

AddEventHandler("entityCreating", function(handle)
    local entityModel = GetEntityModel(handle)

    if Config.RadarAllowedVehicle[entityModel] then
        Entity(handle).state:set("isSirenMuted", false, true)
    end
end)
