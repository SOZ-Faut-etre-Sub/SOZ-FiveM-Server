QBCore = exports["qb-core"]:GetCoreObject()

Fields = {}
Processing = {Enabled = false, StartedAt = 0}

MySQL.ready(function()
    MySQL.query("SELECT * FROM field WHERE owner = 'pawl'", function(fields)
        for _, v in pairs(fields or {}) do
            local data = json.decode(v.data)

            Fields[v.identifier] = Field:new(v.identifier, data.field, data.refillDelay, data.position, data.radius)
            Fields[v.identifier]:RunBackgroundTasks()
        end
    end)
end)

QBCore.Functions.CreateCallback("pawl:server:getFieldData", function(source, cb, identifier)
    local field = Fields[identifier]
    if field ~= nil then
        cb(field:GetField())
    end
    cb(nil)
end)

QBCore.Functions.CreateCallback("pawl:server:harvestTree", function(source, cb, identifier, position)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        cb(false)
        return
    end

    local field = Fields[identifier]
    if field == nil then
        cb(false)
        return
    end

    if exports["soz-inventory"]:CanCarryItems(Player.PlayerData.source, Config.Harvest.RewardItems) then
        local harvest = field:Harvest(position)
        if harvest then
            local cbSent = false
            for _, item in pairs(Config.Harvest.RewardItems) do
                if cbSent then
                    return
                end
                exports["soz-inventory"]:AddItem(Player.PlayerData.source, item.name, item.amount, nil, nil, function(success, reason)
                    if not success then
                        cb(false)
                        cbSent = true
                    end
                end)
            end
            TriggerEvent("monitor:server:event", "job_pawl_harvest_tree", {
                player_source = Player.PlayerData.source,
                field = identifier,
            }, {position = position, amount = 1})

            cb(true)
            return
        end
        cb(false)
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne pouvez pas recevoir d'objet !", "error")
        cb(false)
    end
end)

QBCore.Functions.CreateCallback("pawl:server:harvestTreeSap", function(source, cb, identifier, position)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        cb(false)
        return
    end

    local field = Fields[identifier]
    if field == nil then
        cb(false)
        return
    end

    if exports["soz-inventory"]:CanCarryItems(Player.PlayerData.source, Config.Harvest.SecondaryRewardItems) then
        local harvest = field:TreeExistAtPosition(position)
        if harvest then
            local cbSent = false
            for _, item in pairs(Config.Harvest.SecondaryRewardItems) do
                if cbSent then
                    return
                end
                exports["soz-inventory"]:AddItem(Player.PlayerData.source, item.name, item.amount, nil, nil, function(success, reason)
                    if not success then
                        cb(false)
                        cbSent = true
                    end
                end)
            end
            TriggerEvent("monitor:server:event", "job_pawl_sap_tree", {
                player_source = Player.PlayerData.source,
                field = identifier,
            }, {position = position, amount = 1})

            cb(true)
            return
        end
        cb(false)
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne pouvez pas recevoir d'objet !", "error")
        cb(false)
    end
end)

--- Processing
local function millisecondToMinuteDisplay(time)
    local minutes = math.floor(time / 60000)
    local seconds = math.floor((time % 60000) / 1000)
    return minutes .. "m " .. seconds .. "s"
end

QBCore.Functions.CreateCallback("pawl:server:processingTreeIsEnabled", function(source, cb)
    cb(Processing.Enabled)
end)

RegisterNetEvent("pawl:server:statusProcessingTree", function()
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        return
    end

    if Processing.Enabled then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Il reste " ..
                               millisecondToMinuteDisplay(Processing.StartedAt + Config.Processing.Duration - GetGameTimer()) ..
                               " avant la fin du traitement de l'arbre.", "info")
        return
    end

    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Aucun traitement n'est en cours.", "info")
end)

RegisterNetEvent("pawl:server:stopProcessingTree", function()
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        return
    end

    if Processing.Enabled then
        Processing = {Enabled = false, StartedAt = 0}

        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Le traitement est arrêté.", "info")
        return
    end

    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Aucun traitement est en cours.", "info")
end)

RegisterNetEvent("pawl:server:startProcessingTree", function(data)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        return
    end

    if Processing.Enabled then
        return
    end

    if not exports["soz-inventory"]:CanCarryItem(Config.Processing.PlankStorage, Config.Processing.PlankItem, Config.Processing.PlankAmount) then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Le stockage de planches est plein !", "error")
        return
    end

    if not exports["soz-inventory"]:CanCarryItem(Config.Processing.SawdustStorage, Config.Processing.SawdustItem, Config.Processing.SawdustAmount) then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Le stockage de sciure est plein !", "error")
        return
    end

    Processing.Enabled = true
    Processing.StartedAt = GetGameTimer()
    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Le traitement ~g~commence~s~.")

    Citizen.CreateThread(function()
        while Processing.Enabled do
            if GetGameTimer() - Processing.StartedAt >= Config.Processing.Duration then
                if exports["soz-inventory"]:RemoveItem(Config.Processing.ProcessingStorage, Config.Processing.ProcessingItem, Config.Processing.ProcessingAmount) then
                    exports["soz-inventory"]:AddItem(Config.Processing.PlankStorage, Config.Processing.PlankItem, Config.Processing.PlankAmount)
                    exports["soz-inventory"]:AddItem(Config.Processing.SawdustStorage, Config.Processing.SawdustItem, Config.Processing.SawdustAmount)

                    if exports["soz-inventory"]:GetItem(Config.Processing.ProcessingStorage, Config.Processing.ProcessingItem, nil, true) >= 1 then
                        Processing.StartedAt = GetGameTimer()
                    else
                        Processing.StartedAt = 0
                        Processing.Enabled = false
                        break
                    end
                else
                    Processing.StartedAt = 0
                    Processing.Enabled = false
                    break
                end
            end

            Citizen.Wait(1000)
        end
    end)
end)

--- Crafting
function pairsByKeys(t)
    local a = {}
    for n in pairs(t) do
        table.insert(a, n)
    end
    table.sort(a)
    local i = 0
    local iter = function()
        i = i + 1
        if a[i] == nil then
            return nil
        else
            return a[i], t[a[i]]
        end
    end
    return iter
end

RegisterNetEvent("pawl:server:craft", function(identifier)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        return
    end

    local craft = Config.Craft[identifier]
    if craft == nil then
        return
    end

    if not exports["soz-inventory"]:CanCarryItem(Player.PlayerData.source, craft.RewardItem, craft.RewardAmount) then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne pouvez pas fabriquer d'objet en ce moment.", "error")
        return
    end

    local craftItemInventory = exports["soz-inventory"]:GetItem(Player.PlayerData.source, craft.SourceItem, nil, true)

    if craftItemInventory < (craft.SourceItemAmount or 1) then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas assez de planches !", "error")
        return
    end

    local metadata = {}
    if craft.RewardTier then
        math.randomseed(GetGameTimer())
        local random = math.random(1, 100)

        for _, tier in pairsByKeys(craft.RewardTier) do
            metadata.tier = tier.Id
            metadata.label = tier.Name

            if random <= tier.Chance then
                break
            end
        end
    end

    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, craft.SourceItem, craft.SourceItemAmount or 1) then
        exports["soz-inventory"]:AddItem(Player.PlayerData.source, craft.RewardItem, craft.RewardAmount, metadata, nil, function(success, reason)
            if success then
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez récupéré ~g~" .. craft.Name .. "~s~ !", "success")

                TriggerEvent("monitor:server:event", "job_pawl_craft",
                             {player_source = Player.PlayerData.source, item = craft.RewardItem, tier = metadata.tier}, {
                    amount = craft.RewardAmount,
                })
            else
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne pouvez pas récupérer d'objet !", "error")
            end
        end)
    end
end)

exports("GetPawlMetrics", function()
    local metrics = {}

    -- Degradation Level
    metrics["degradation_percent"] = {{value = GetDegradationPercentage()}}

    -- Fields
    for identifier, field in pairs(Fields) do
        local metric = {["identifier"] = identifier, value = field:GetTrees() - field:GetCuttedTrees()}

        metrics[identifier] = {metric}
    end

    return metrics
end)
