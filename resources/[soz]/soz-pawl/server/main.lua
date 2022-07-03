QBCore = exports["qb-core"]:GetCoreObject()

Fields = {}

for k, v in pairs(Config.Fields) do
    Fields[k] = Field:new(k, v.model, v.positions, v.refillDelay)

    Fields[k]:FullRefillField()
    Fields[k]:RunBackgroundTasks()
end

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

    if exports["soz-inventory"]:CanCarryItem(Player.PlayerData.source, Config.Harvest.RewardItem, 1) then
        local harvest = field:Harvest(position)
        if harvest then
            exports["soz-inventory"]:AddItem(Player.PlayerData.source, Config.Harvest.RewardItem, 1, nil, nil, function(success, reason)
                cb(success)
                return
            end)
        end
        cb(false)
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne pouvez pas recevoir d'objet !", "error")
        cb(false)
    end
end)

--- Processing
Citizen.CreateThread(function()
    while true do
        if not exports["soz-inventory"]:CanCarryItem(Config.Processing.PlankStorage, Config.Processing.PlankItem, Config.Processing.PlankAmount) then
            goto wait_next_processing
            return
        end

        if not exports["soz-inventory"]:CanCarryItem(Config.Processing.SawdustStorage, Config.Processing.SawdustItem, Config.Processing.SawdustAmount) then
            goto wait_next_processing
            return
        end

        --- Voluntary skip error handling, if storage is updated by player and it's not possible to add items, it will consume log.
        if exports["soz-inventory"]:RemoveItem(Config.Processing.ProcessingStorage, Config.Processing.ProcessingItem, Config.Processing.ProcessingAmount) then
            exports["soz-inventory"]:AddItem(Config.Processing.PlankStorage, Config.Processing.PlankItem, Config.Processing.PlankAmount)
            exports["soz-inventory"]:AddItem(Config.Processing.SawdustStorage, Config.Processing.SawdustItem, Config.Processing.SawdustAmount)
        end

        ::wait_next_processing::
        Citizen.Wait(60 * 1000)
    end
end)


--- Crafting
local function pairsByKeys(t)
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
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Le stockage n'a pas assez de planche !", "error")
        return
    end

    local metadata = {}
    if craft.RewardTier then
        local random = math.random(1, 100)

        for tierId, tier in pairsByKeys(craft.RewardTier) do
            if random >= tier.Chance then
                metadata.tier = tierId
                metadata.label = tier.Name
                break
            end
        end
    end

    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, craft.SourceItem, craft.SourceItemAmount or 1) then
        exports["soz-inventory"]:AddItem(Player.PlayerData.source, craft.RewardItem, craft.RewardAmount, metadata, nil, function(success, reason)
            if success then
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez récupéré ~g~" .. craft.Name .. "~s~ !", "success")
            else
                TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne pouvez pas récupérer d'objet !", "error")
            end
        end)
    end
end)
