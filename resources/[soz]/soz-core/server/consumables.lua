QBCore = exports["qb-core"]:GetCoreObject()

local function removeItemAndSendEvent(source, item, event, extra)
    local Player = QBCore.Functions.GetPlayer(source)
    if exports["soz-inventory"]:RemoveItem(Player.PlayerData.source, item.name, 1, item.metadata, item.slot) then
        TriggerClientEvent(event, Player.PlayerData.source, item.name, extra)
    end
end

--- Eat
QBCore.Functions.CreateUseableItem("sandwich", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:Eat")
end)

QBCore.Functions.CreateUseableItem("twerks_candy", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:Eat")
end)

QBCore.Functions.CreateUseableItem("snikkel_candy", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:Eat")
end)

QBCore.Functions.CreateUseableItem("tosti", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:Eat")
end)

--- Drink
QBCore.Functions.CreateUseableItem("water_bottle", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:Drink")
end)

QBCore.Functions.CreateUseableItem("coffee", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:Drink")
end)

QBCore.Functions.CreateUseableItem("kurkakola", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:Drink")
end)

--- Alcohol
QBCore.Functions.CreateUseableItem("vodka", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:DrinkAlcohol", "prop_drink_whisky")
end)

QBCore.Functions.CreateUseableItem("beer", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:DrinkAlcohol", "prop_amb_beer_bottle")
end)

QBCore.Functions.CreateUseableItem("whiskey", function(source, item)
    removeItemAndSendEvent(source, item, "consumables:client:DrinkAlcohol", "prop_drink_whisky")
end)

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
QBCore.Functions.CreateUseableItem("armor", function(source, item)
    TriggerClientEvent("consumables:client:UseArmor", source)
end)

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
QBCore.Functions.CreateUseableItem("cardboard", function(source)
    TriggerClientEvent("consumables:client:UseCardBoard", source, false)
    TriggerServerEvent("job:server:placeProps", value.item, value.props, value.rotation)
end)
