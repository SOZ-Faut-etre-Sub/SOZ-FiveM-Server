local function removeItemAndSendEvent(source, item, event, extra)
    local Player = QBCore.Functions.GetPlayer(source)
    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item.name, 1, item.metadata, item.slot) then
        TriggerClientEvent(event, Player.PlayerData.source, item.name, extra)
    end
end

local function preventUsageWhileHoldingWeapon(source)
    return true
end

--- Drug
QBCore.Functions.CreateUseableItem("joint", function(source, item)
    if not preventUsageWhileHoldingWeapon(source) then
        return
    end
    removeItemAndSendEvent(source, item, "consumables:client:UseJoint")
end)

QBCore.Functions.CreateUseableItem("cokebaggy", function(source, item)
    if not preventUsageWhileHoldingWeapon(source) then
        return
    end
    removeItemAndSendEvent(source, item, "consumables:client:DrugsBag")
end)

QBCore.Functions.CreateUseableItem("crack_baggy", function(source, item)
    if not preventUsageWhileHoldingWeapon(source) then
        return
    end
    removeItemAndSendEvent(source, item, "consumables:client:DrugsBag")
end)

QBCore.Functions.CreateUseableItem("xtcbaggy", function(source, item)
    if not preventUsageWhileHoldingWeapon(source) then
        return
    end
    removeItemAndSendEvent(source, item, "consumables:client:DrugsBag")
end)

QBCore.Functions.CreateUseableItem("meth", function(source, item)
    if not preventUsageWhileHoldingWeapon(source) then
        return
    end
    removeItemAndSendEvent(source, item, "consumables:client:DrugsBag")
end)

--- Tools
QBCore.Functions.CreateUseableItem("binoculars", function(source, item)
    if not preventUsageWhileHoldingWeapon(source) then
        return
    end
    TriggerClientEvent("items:binoculars:toggle", source)
end)

--- Soz
QBCore.Functions.CreateUseableItem("cardbord", function(source)
    if not preventUsageWhileHoldingWeapon(source) then
        return
    end
    TriggerClientEvent("consumables:client:UseCardBoard", source)
end)

QBCore.Functions.CreateUseableItem("diving_gear", function(source)
    if not preventUsageWhileHoldingWeapon(source) then
        return
    end
    local Player = QBCore.Functions.GetPlayer(source)

    local scuba = Player.PlayerData.metadata["scuba"]
    if scuba == nil then
        scuba = false
    end

    scuba = not scuba
    Player.Functions.SetMetaData("scuba", scuba)

    TriggerClientEvent("scuba:client:Toggle", source, scuba)
end)
