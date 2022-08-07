local function removeItemAndSendEvent(source, item, event, extra)
    local Player = QBCore.Functions.GetPlayer(source)
    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item.name, 1, item.metadata, item.slot) then
        TriggerClientEvent(event, Player.PlayerData.source, item.name, extra)
    end
end

local function preventUsageWhileHoldingWeapon(source)
    local state = Player(source).state
    if state.CurrentWeaponData ~= nil then
        TriggerClientEvent("hud:client:DrawNotification", source, "Votre main est déjà occupée à porter une arme.", "error")
        return false
    end
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

--- Firework
QBCore.Functions.CreateUseableItem("firework1", function(source, item)
    if not preventUsageWhileHoldingWeapon(source) then
        return
    end
    TriggerClientEvent("fireworks:client:UseFirework", source, item.name, "proj_indep_firework")
end)

QBCore.Functions.CreateUseableItem("firework2", function(source, item)
    if not preventUsageWhileHoldingWeapon(source) then
        return
    end
    TriggerClientEvent("fireworks:client:UseFirework", source, item.name, "proj_indep_firework_v2")
end)

QBCore.Functions.CreateUseableItem("firework3", function(source, item)
    if not preventUsageWhileHoldingWeapon(source) then
        return
    end
    TriggerClientEvent("fireworks:client:UseFirework", source, item.name, "proj_xmas_firework")
end)

QBCore.Functions.CreateUseableItem("firework4", function(source, item)
    if not preventUsageWhileHoldingWeapon(source) then
        return
    end
    TriggerClientEvent("fireworks:client:UseFirework", source, item.name, "scr_indep_fireworks")
end)

--- Lockpick
QBCore.Functions.CreateUseableItem("lockpick", function(source, item)
    if not preventUsageWhileHoldingWeapon(source) then
        return
    end
    TriggerClientEvent("lockpicks:UseLockpick", source)
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

--- LSMC

QBCore.Functions.CreateUseableItem("walkstick", function(source, item)
    if not preventUsageWhileHoldingWeapon(source) then
        return
    end
    TriggerClientEvent("items:walkstick:toggle", source)
end)
