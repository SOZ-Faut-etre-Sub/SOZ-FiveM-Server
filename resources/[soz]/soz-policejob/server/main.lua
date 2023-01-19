QBCore = exports["qb-core"]:GetCoreObject()
SozJobCore = exports["soz-jobs"]:GetCoreObject()

--- Cuff
RegisterNetEvent("police:server:CuffPlayer", function(targetId, isSoftcuff)
    local player = QBCore.Functions.GetPlayer(source)
    local target = QBCore.Functions.GetPlayer(targetId)

    if target then
        if player.Functions.GetItemByName("handcuffs") then
            exports["soz-inventory"]:RemoveItem(player.PlayerData.source, "handcuffs", 1)
            target.Functions.SetMetaData("ishandcuffed", true)
            target.Functions.UpdatePlayerData()
            Player(target.PlayerData.source).state:set("ishandcuffed", true, true)

            TriggerClientEvent("police:client:HandCuffAnimation", player.PlayerData.source)
            TriggerClientEvent("police:client:GetCuffed", target.PlayerData.source, player.PlayerData.source, isSoftcuff)
            TriggerClientEvent("soz-talk:client:PowerOffRadio", target.PlayerData.source)
        else
            TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source, "Vous n'avez pas de ~r~menotte", "error")
        end
    end
end)

RegisterNetEvent("police:server:UnCuffPlayer", function(targetId)
    local player = QBCore.Functions.GetPlayer(source)
    local target = QBCore.Functions.GetPlayer(targetId)

    if target then
        if player.Functions.GetItemByName("handcuffs_key") then
            exports["soz-inventory"]:RemoveItem(player.PlayerData.source, "handcuffs_key", 1)

            TriggerClientEvent("police:client:UnCuffAnimation", player.PlayerData.source)
            Wait(3000)

            target.Functions.SetMetaData("ishandcuffed", false)
            Player(target.PlayerData.source).state:set("ishandcuffed", false, true)
            TriggerClientEvent("police:client:GetUnCuffed", target.PlayerData.source)
        else
            TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source, "Vous n'avez pas de ~r~clé de menotte", "error")
        end
    end
end)

--- Escort
RegisterNetEvent("police:server:EscortPlayer", function(playerId)
    local player = QBCore.Functions.GetPlayer(source)
    local target = QBCore.Functions.GetPlayer(playerId)

    if player and target and player ~= target then
        for _, allowedJob in ipairs(Config.AllowedJobDragInteraction) do
            if player.PlayerData.job.id == allowedJob then
                Player(player.PlayerData.source).state:set("isEscorting", true, true)
                Player(player.PlayerData.source).state:set("escorting", target.PlayerData.source, true)
                Player(target.PlayerData.source).state:set("isEscorted", true, true)

                TriggerClientEvent("police:client:SetEscorting", player.PlayerData.source, target.PlayerData.source)
                TriggerClientEvent("police:client:GetEscorted", target.PlayerData.source, player.PlayerData.source)

                return
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
        for _, allowedJob in ipairs(Config.AllowedJobDragInteraction) do
            if player.PlayerData.job.id == allowedJob then
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

--- Licenses
QBCore.Functions.CreateCallback("police:server:getLicenses", function(source, cb, targetId)
    local player = QBCore.Functions.GetPlayer(source)
    local target = QBCore.Functions.GetPlayer(targetId)

    if player and target and player ~= target then
        for _, allowedJob in ipairs(Config.AllowedJobInteraction) do
            if player.PlayerData.job.id == allowedJob then
                cb(target.PlayerData.metadata["licences"])

                return
            end
        end
    end
end)

RegisterNetEvent("police:server:RemovePoint", function(targetId, licenseType, point)
    local player = QBCore.Functions.GetPlayer(source)
    local target = QBCore.Functions.GetPlayer(targetId)

    if player and target and player ~= target then
        for _, allowedJob in ipairs(Config.AllowedJobInteraction) do
            if player.PlayerData.job.id == allowedJob then
                local licenses = target.PlayerData.metadata["licences"]

                if licenses[licenseType] >= point then
                    licenses[licenseType] = licenses[licenseType] - point

                    if licenses[licenseType] >= 1 then
                        TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source,
                                           "Vous avez retiré ~b~" .. point .. " point" .. (point > 1 and "s" or "") .. "~s~ sur le permis")
                        TriggerClientEvent("hud:client:DrawNotification", target.PlayerData.source,
                                           "~b~" .. point .. " point" .. (point > 1 and "s" or "") .. "~s~ ont été retiré de votre permis !", "info")
                    else
                        TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source, "Vous avez retiré le permis")
                        TriggerClientEvent("hud:client:DrawNotification", target.PlayerData.source, "Votre permis vous a été retiré !", "info")
                    end

                    target.Functions.SetMetaData("licences", licenses)
                else
                    TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source, "Il n'y a pas assez de point sur le permis", "error")
                end

                return
            end
        end
    end
end)

RegisterNetEvent("police:server:RemoveLicense", function(targetId, licenseType, point)
    local player = QBCore.Functions.GetPlayer(source)
    local target = QBCore.Functions.GetPlayer(targetId)

    if player and target and player ~= target then
        for _, allowedJob in ipairs(Config.AllowedJobInteraction) do
            if player.PlayerData.job.id == allowedJob then
                local licenses = target.PlayerData.metadata["licences"]

                if licenses[licenseType] then
                    licenses[licenseType] = false

                    TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source,
                                       "Vous avez retiré le permis: ~b~" .. Config.Licenses[licenseType].label)
                    TriggerClientEvent("hud:client:DrawNotification", target.PlayerData.source,
                                       "Votre permis ~b~" .. Config.Licenses[licenseType].label .. "~s~ vous a été retiré !", "info")

                    target.Functions.SetMetaData("licences", licenses)
                else
                    TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source, "Ce permis est déjà invalide", "error")
                end

                return
            end
        end
    end
end)

RegisterNetEvent("police:server:GiveLicense", function(targetId, licenseType)
    local player = QBCore.Functions.GetPlayer(source)
    local target = QBCore.Functions.GetPlayer(targetId)

    if player and target and player ~= target then
        for _, allowedJob in ipairs(Config.AllowedJobInteraction) do
            if player.PlayerData.job.id == allowedJob then
                local licenses = target.PlayerData.metadata["licences"]

                if not licenses[licenseType] then
                    licenses[licenseType] = true

                    TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source,
                                       "Vous avez donné le permis: ~b~" .. Config.Licenses[licenseType].label)
                    TriggerClientEvent("hud:client:DrawNotification", target.PlayerData.source,
                                       "Vous avez reçu un nouveau permis : ~b~" .. Config.Licenses[licenseType].label .. "~s~ !", "info")

                    target.Functions.SetMetaData("licences", licenses)
                else
                    TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source, "Ce permis est déjà valide", "error")
                end

                return
            end
        end
    end
end)

--- Wanted
QBCore.Functions.CreateCallback("police:server:GetWantedPlayers", function(source, cb)
    local player = QBCore.Functions.GetPlayer(source)

    if player then
        for _, allowedJob in ipairs(Config.AllowedJobInteraction) do
            if player.PlayerData.job.id == allowedJob then
                cb(MySQL.query.await("SELECT * FROM `phone_twitch_news` WHERE type = ?", {player.PlayerData.job.id}) or {})

                return
            end
        end
    end
end)

QBCore.Functions.CreateCallback("police:server:DeleteWantedPlayer", function(source, cb, id)
    local player = QBCore.Functions.GetPlayer(source)

    if player then
        for _, allowedJob in ipairs(Config.AllowedJobInteraction) do
            if player.PlayerData.job.id == allowedJob then
                cb(MySQL.execute.await("UPDATE `phone_twitch_news` SET type = @type WHERE id = @id",
                                       {["@id"] = id, ["@type"] = player.PlayerData.job.id .. ":end"}).changedRows >= 1)

                return
            end
        end
    end
end)

--- Other
AddEventHandler("entityCreating", function(handle)
    local entityModel = GetEntityModel(handle)

    if Config.SirenVehicle[entityModel] then
        Entity(handle).state:set("isSirenMuted", false, true)
    end
end)
