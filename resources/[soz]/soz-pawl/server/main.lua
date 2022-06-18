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
