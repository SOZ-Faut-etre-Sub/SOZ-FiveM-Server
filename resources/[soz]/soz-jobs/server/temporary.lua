RegisterServerEvent("job:set:unemployed", function()
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous êtes à nouveau sans emploi"))
    Player.Functions.SetJob(SozJobCore.JobType.Unemployed, nil)
end)

RegisterServerEvent("job:set:pole", function(jobId)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    local job = SozJobCore.Jobs[jobId]

    if not job then
        return
    end

    TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous commencez le travail: %s", job.label))

    local gradeId = nil

    for id, grade in ipairs(job.grades) do
        if grade.is_default == 1 then
            gradeId = id

            break
        end
    end

    Player.Functions.SetJob(jobId, GetJobDefaultGrade(jobId))
end)

RegisterServerEvent("job:payout", function(money)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    Player.Functions.AddMoney("money", money)
    TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous recevez: %s $ pour votre travail", money))
end)

RegisterServerEvent("job:payout:metal", function(money, source)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    Player.Functions.AddMoney("money", money)
    TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous recevez: %s $ pour votre travail", money))
end)

RegisterServerEvent("job:anounce", function(string)
    TriggerClientEvent("hud:client:DrawNotification", source, string.format(string))
end)

RegisterServerEvent("job:get:metal", function(amount)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    local metadata = {}
    exports["soz-inventory"]:AddItem(Player.PlayerData.source, "metalscrap", amount, metadata, nil, function(success, reason)
        if success then
            TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous avez ramassé %d ferrailles", amount))
        else
            if reason == "invalid_weight" then
                TriggerClientEvent("hud:client:DrawNotification", source, "Vos poches sont pleines...", "error")
            else
                TriggerClientEvent("hud:client:DrawNotification", source, string.format("Il y a eu une erreur: %s", reason), "error")
            end
        end
    end)
end)

RegisterServerEvent("job:remove:metal", function(amount)
    local Player = QBCore.Functions.GetPlayer(tonumber(source))
    local totalAmount = exports["soz-inventory"]:GetItem(Player.PlayerData.source, "metalscrap", nil, true)
    if tonumber(amount) <= tonumber(totalAmount) then
        exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, "metalscrap", amount, nil)
        TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous avez vendu %d ferrailles", amount))
        local payout = amount * SozJobCore.metal_payout
        TriggerEvent("job:payout:metal", payout, source)
    else
        TriggerClientEvent("hud:client:DrawNotification", source, string.format("Vous essayez de vendre plus que ce que vous ne possédez", amount), "error")
    end
end)
