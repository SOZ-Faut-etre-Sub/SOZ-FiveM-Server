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
            exports["soz-core"]:SetPlayerState(target.PlayerData.source, {isHandcuffed = true})

            TriggerClientEvent("police:client:HandCuffAnimation", player.PlayerData.source)
            TriggerClientEvent("police:client:GetCuffed", target.PlayerData.source, player.PlayerData.source, isSoftcuff)
            TriggerClientEvent("soz-talk:client:PowerOffRadio", target.PlayerData.source)
        else
            TriggerClientEvent("soz-core:client:notification:draw", player.PlayerData.source, "Vous n'avez pas de ~r~menottes", "error")
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
            exports["soz-core"]:SetPlayerState(target.PlayerData.source, {isHandcuffed = false})
            TriggerClientEvent("police:client:GetUnCuffed", target.PlayerData.source)
            TriggerClientEvent("soz-talk:client:PowerOnradio", target.PlayerData.source)
        else
            TriggerClientEvent("soz-core:client:notification:draw", player.PlayerData.source, "Vous n'avez pas de ~r~clé de menottes", "error")
        end
    end
end)

--- Escort
RegisterNetEvent("police:server:EscortPlayer", function(playerId, crimi)
    local player = QBCore.Functions.GetPlayer(source)
    local target = QBCore.Functions.GetPlayer(playerId)

    if player and target and player ~= target then
        exports["soz-core"]:SetPlayerState(target.PlayerData.source, {isEscorted = true})
        exports["soz-core"]:SetPlayerState(player.PlayerData.source, {
            isEscorting = true,
            escorting = target.PlayerData.source,
        })

        TriggerClientEvent("police:client:SetEscorting", player.PlayerData.source, target.PlayerData.source, crimi)
        TriggerClientEvent("police:client:GetEscorted", target.PlayerData.source, player.PlayerData.source, crimi)

        return
    end
end)

RegisterNetEvent("police:server:DeEscortPlayer", function(playerId)
    local player = QBCore.Functions.GetPlayer(source)
    local target = QBCore.Functions.GetPlayer(playerId)

    local playerState = exports["soz-core"]:GetPlayerState(player.PlayerData.source);
    local targetState = exports["soz-core"]:GetPlayerState(target.PlayerData.source);

    if player and target and player ~= target then
        if playerState.isEscorting and playerState.escorting == target.PlayerData.source and targetState.isEscorted then
            exports["soz-core"]:SetPlayerState(target.PlayerData.source, {isEscorted = false})
            exports["soz-core"]:SetPlayerState(player.PlayerData.source, {isEscorting = false, escorting = 0})

            TriggerClientEvent("police:client:DeEscort", target.PlayerData.source)

            return
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
                -- Hide real value in case fake license
                local realNewvValue = math.max(licenses[licenseType] - point, 0)
                licenses[licenseType] = realNewvValue

                TriggerClientEvent("soz-core:client:notification:draw", player.PlayerData.source,
                                   "Vous avez retiré ~b~" .. point .. " point" .. (point > 1 and "s" or "") .. "~s~ sur le permis")
                TriggerClientEvent("soz-core:client:notification:draw", target.PlayerData.source,
                                   "~b~" .. point .. " point" .. (point > 1 and "s" or "") .. "~s~ ont été retirés de votre permis !", "info")

                target.Functions.SetMetaData("licences", licenses)

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

                    TriggerClientEvent("soz-core:client:notification:draw", player.PlayerData.source,
                                       "Vous avez retiré le permis: ~b~" .. Config.Licenses[licenseType].label)
                    TriggerClientEvent("soz-core:client:notification:draw", target.PlayerData.source,
                                       "Votre permis ~b~" .. Config.Licenses[licenseType].label .. "~s~ vous a été retiré !", "info")

                    target.Functions.SetMetaData("licences", licenses)
                else
                    TriggerClientEvent("soz-core:client:notification:draw", player.PlayerData.source, "Ce permis est déjà invalide", "error")
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

                    TriggerClientEvent("soz-core:client:notification:draw", player.PlayerData.source,
                                       "Vous avez donné le permis: ~b~" .. Config.Licenses[licenseType].label)
                    TriggerClientEvent("soz-core:client:notification:draw", target.PlayerData.source,
                                       "Vous avez reçu un nouveau permis : ~b~" .. Config.Licenses[licenseType].label .. "~s~ !", "info")

                    target.Functions.SetMetaData("licences", licenses)
                else
                    TriggerClientEvent("soz-core:client:notification:draw", player.PlayerData.source, "Ce permis est déjà valide", "error")
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

                TriggerClientEvent("phone:app:news:reloadNews", -1)
                return
            end
        end
    end
end)
