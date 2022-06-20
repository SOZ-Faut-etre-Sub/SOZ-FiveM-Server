QBCore = exports["qb-core"]:GetCoreObject()

Fields = {}
Processing = {Enabled = false, StartedAt = 0}

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

local function millisecondToMinuteDisplay(time)
    local minutes = math.floor(time / 60000)
    local seconds = math.floor((time % 60000) / 1000)
    return minutes .. "m " .. seconds .. "s"
end

--- Processing
RegisterNetEvent("pawl:server:processingTree", function(data)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player == nil then
        return
    end

    if Processing.Enabled then
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous ne pouvez pas traiter d'arbre en ce moment.", "error")
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source,
                           "Il vous reste " .. millisecondToMinuteDisplay(Processing.StartedAt + Config.Processing.Duration - GetGameTimer()) ..
                               " secondes avant de pouvoir traiter d'autre arbre.", "info")
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
    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous avez ~g~commencé~s~ à traiter un arbre.")

    Citizen.CreateThread(function()
        while Processing.Enabled do
            if GetGameTimer() - Processing.StartedAt >= Config.Processing.Duration then
                --- Voluntary skip error handling, if storage is updated by player and it's not possible to add items, it will consume log.
                exports["soz-inventory"]:AddItem(Config.Processing.PlankStorage, Config.Processing.PlankItem, Config.Processing.PlankAmount)
                exports["soz-inventory"]:AddItem(Config.Processing.SawdustStorage, Config.Processing.SawdustItem, Config.Processing.SawdustAmount)

                Processing.Enabled = false
                break
            end

            Citizen.Wait(1000)
        end
    end)
end)
