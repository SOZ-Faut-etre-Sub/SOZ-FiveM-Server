QBCore = exports["qb-core"]:GetCoreObject()

local function removeItemAndSendEvent(source, item, event, extra)
    local Player = QBCore.Functions.GetPlayer(source)
    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item.name, 1, item.metadata, item.slot) then
        TriggerClientEvent(event, Player.PlayerData.source, item.name, extra)
    end
end

local function itemIsExpired(item)
    if item.metadata.expiration ~= nil then
        local year, month, day = string.match(item.metadata.expiration, "(%d+)-(%d+)-(%d+)")
        return os.time({year = year, month = month, day = day}) < os.time()
    end
end

--- Eat
for name, _ in pairs(ConsumablesEat) do
    QBCore.Functions.CreateUseableItem(name, function(source, item)
        removeItemAndSendEvent(source, item, "consumables:client:Eat", itemIsExpired(item))
    end)
end

--- Drink
for name, _ in pairs(ConsumablesDrink) do
    QBCore.Functions.CreateUseableItem(name, function(source, item)
        removeItemAndSendEvent(source, item, "consumables:client:Drink", itemIsExpired(item))
    end)
end

--- Alcohol
for name, _ in pairs(ConsumablesAlcohol) do
    QBCore.Functions.CreateUseableItem(name, function(source, item)
        removeItemAndSendEvent(source, item, "consumables:client:DrinkAlcohol", {
            model = "prop_amb_beer_bottle",
            expired = itemIsExpired(item),
        })
    end)
end

--- Drug
QBCore.Functions.CreateUseableItem("joint", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:UseJoint")
end)

QBCore.Functions.CreateUseableItem("cokebaggy", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:DrugsBag")
end)

QBCore.Functions.CreateUseableItem("crack_baggy", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:DrugsBag")
end)

QBCore.Functions.CreateUseableItem("xtcbaggy", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:DrugsBag")
end)

QBCore.Functions.CreateUseableItem("meth", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:DrugsBag")
end)

--- Tools
QBCore.Functions.CreateUseableItem("binoculars", function(source, item)
    TriggerClientEvent("binoculars:Toggle", source)
end)

--- Firework
QBCore.Functions.CreateUseableItem("firework1", function(source, item)
    TriggerClientEvent("fireworks:client:UseFirework", source, item.name, "proj_indep_firework")
end)

QBCore.Functions.CreateUseableItem("firework2", function(source, item)
    TriggerClientEvent("fireworks:client:UseFirework", source, item.name, "proj_indep_firework_v2")
end)

QBCore.Functions.CreateUseableItem("firework3", function(source, item)
    TriggerClientEvent("fireworks:client:UseFirework", source, item.name, "proj_xmas_firework")
end)

QBCore.Functions.CreateUseableItem("firework4", function(source, item)
    TriggerClientEvent("fireworks:client:UseFirework", source, item.name, "scr_indep_fireworks")
end)

--- Lockpick
QBCore.Functions.CreateUseableItem("lockpick", function(source, item)
    TriggerClientEvent("lockpicks:UseLockpick", source)
end)

--- Soz
QBCore.Functions.CreateUseableItem("cardbord", function(source)
    TriggerClientEvent("consumables:client:UseCardBoard", source)
end)
