QBCore = exports["qb-core"]:GetCoreObject()
SozJobCore = exports["soz-jobs"]:GetCoreObject()

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
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas de ~r~menotte", "error")
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
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas de ~r~clé de menotte", "error")
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

                TriggerClientEvent("police:client:SetEscorting", player.PlayerData.source)
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
RegisterNetEvent("police:server:buy", function(weaponID)
    local player = QBCore.Functions.GetPlayer(source)

    if not Config.WeaponShop[player.PlayerData.job.id] then
        return
    end

    local weapon = Config.WeaponShop[player.PlayerData.job.id][weaponID]

    if player.Functions.RemoveMoney("money", weapon.price) then
        weapon.metadata.serie = tostring(string.upper(player.PlayerData.job.id) .. QBCore.Shared.RandomInt(1) .. QBCore.Shared.RandomStr(2) ..
                                             QBCore.Shared.RandomInt(3) .. QBCore.Shared.RandomStr(4))

        exports["soz-inventory"]:AddItem(player.PlayerData.source, weapon.name, weapon.amount, weapon.metadata, nil, function(success, reason)
            if success then
                TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source,
                                   ("Vous venez d'acheter ~b~%s %s~s~ pour ~g~$%s"):format(weapon.amount, QBCore.Shared.Items[weapon.name].label, weapon.price))
            end
        end)
    else
        TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source, "Vous n'avez pas assez d'argent", "error")
    end
end)

AddEventHandler("entityCreating", function(handle)
    local entityModel = GetEntityModel(handle)

    if Config.RadarAllowedVehicle[entityModel] then
        Entity(handle).state:set("isSirenMuted", false, true)
    end
end)
