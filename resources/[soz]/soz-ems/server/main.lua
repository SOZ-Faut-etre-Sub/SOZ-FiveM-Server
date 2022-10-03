QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("soz-ems:server:setLit", function(id, isUsed)
    TriggerEvent("soz-ems:client:lit", -1, id, isUsed)
end)

RegisterServerEvent("lsmc:server:remove")
AddEventHandler("lsmc:server:remove", function(item)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item, 1, nil)
end)

RegisterServerEvent("lsmc:server:add")
AddEventHandler("lsmc:server:add", function(item)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    exports["soz-inventory"]:AddItem(Player.PlayerData.source, item, 1, nil)
end)

RegisterServerEvent("lsmc:server:revive")
AddEventHandler("lsmc:server:revive", function(id)
    local player = QBCore.Functions.GetPlayer(tonumber(id))
    TriggerClientEvent("soz_ems:client:Revive", player.PlayerData.source)
    TriggerClientEvent("lsmc:maladie:client:ApplyCurrentDiseaseEffect", player.PlayerData.source, false)
    player.Functions.SetMetaData("hunger", player.PlayerData.metadata["hunger"] + 30)
    player.Functions.SetMetaData("thirst", player.PlayerData.metadata["thirst"] + 30)
    player.Functions.SetMetaData("alcohol", player.PlayerData.metadata["alcohol"] - 50)
    player.Functions.SetMetaData("isdead", false)
    Player(player.PlayerData.source).state.isdead = false
end)

RegisterServerEvent("lsmc:server:heal")
AddEventHandler("lsmc:server:heal", function(id)
    local Player = QBCore.Functions.GetPlayer(tonumber(id))
    TriggerClientEvent("lsmc:client:heal", Player.PlayerData.source, Player.PlayerData.metadata["disease"])
end)

RegisterServerEvent("lsmc:server:GiveBlood")
AddEventHandler("lsmc:server:GiveBlood", function(id)
    local Player = QBCore.Functions.GetPlayer(tonumber(id))
    TriggerClientEvent("lsmc:client:GiveBlood", Player.PlayerData.source)
end)

-- Other
RegisterNetEvent("ems:server:buy", function(itemID)
    local player = QBCore.Functions.GetPlayer(source)

    if not Config.BossShop[player.PlayerData.job.id] then
        return
    end

    local item = Config.BossShop[player.PlayerData.job.id][itemID]

    if player.Functions.RemoveMoney("money", item.price) then
        TriggerEvent("monitor:server:event", "shop_buy", {player_source = player.PlayerData.source, shop_type = "job"},
                     {item_name = item.name, amount = item.price})

        exports["soz-inventory"]:AddItem(player.PlayerData.source, item.name, item.amount, item.metadata, nil, function(success, reason)
            if success then
                TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source,
                                   ("Vous venez d'acheter ~b~%s %s~s~ pour ~g~$%s"):format(item.amount, QBCore.Shared.Items[item.name].label, item.price))
            end
        end)
    else
        TriggerClientEvent("hud:client:DrawNotification", player.PlayerData.source, "Vous n'avez pas assez d'argent", "error")
    end
end)

QBCore.Functions.CreateCallback("lsmc:server:IsDead", function(source, cb, id)
    local Player = QBCore.Functions.GetPlayer(id)
    local isdead = Player.PlayerData.metadata["isdead"]
    cb(isdead)
end)

RegisterServerEvent("lsmc:server:tp")
AddEventHandler("lsmc:server:tp", function(id, coords)
    local Player = QBCore.Functions.GetPlayer(tonumber(id))
    TriggerClientEvent("lsmc:client:VehTpDead", Player.PlayerData.source, coords)
end)

RegisterServerEvent("lsmc:server:SetItt")
AddEventHandler("lsmc:server:SetItt", function(id)
    local Player = QBCore.Functions.GetPlayer(tonumber(id))
    local itt = Player.PlayerData.metadata["itt"]

    if itt == nil then
        itt = false
    end

    if itt then
        Player.Functions.SetMetaData("itt", false)
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous pouvez reprendre le travail")
        TriggerClientEvent("hud:client:DrawNotification", source, "Vous avez enlevé l'interdiction de travail temporaire")
    else
        if Player.PlayerData.job.onduty then
            Player.Functions.SetJobDuty(false)
            TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous êtes hors service", "info")
        end

        Player.Functions.SetMetaData("itt", true)
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez été mis en interdiction de travail temporaire")
        TriggerClientEvent("hud:client:DrawNotification", source, "Vous avez mis la personne en interdiction de travail temporaire")
    end
end)

RegisterServerEvent("lsmc:server:SetPatientOutfit", function(target, useOutfit)
    local player = QBCore.Functions.GetPlayer(tonumber(target))
    if not player then
        return
    end

    Player(player.PlayerData.source).state.isWearingPatientOutfit = useOutfit

    if useOutfit then
        TriggerClientEvent("ems:client:applyPatientClothing", player.PlayerData.source)
    else
        TriggerClientEvent("ems:client:removePatientClothing", player.PlayerData.source)
    end
end)

QBCore.Functions.CreateCallback("lsmc:server:IsItt", function(source, cb, id)
    local Player = QBCore.Functions.GetPlayer(id)
    local itt = Player.PlayerData.metadata["itt"]

    if itt == nil then
        itt = false
    end

    cb(itt)
end)
