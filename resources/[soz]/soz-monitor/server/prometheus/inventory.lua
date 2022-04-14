-- Get all metrics about inventory
local playerInventoryList = {}

local function BuildListFromDatabase()
    local players = MySQL.query.await("SELECT * FROM player WHERE is_default = 1", {})

    for _, player in ipairs(players) do
        local charinfo = json.decode(player.charinfo)

        playerInventoryList[player.citizenid] = {
            name = charinfo.firstname .. " " .. charinfo.lastname,
            items = json.decode(player.inventory),
            type = "player",
            slots = 30,
            maxWeight = 80000,
        }
    end
end

local function OverrideConnected()
    local players = QBCore.Functions.GetQBPlayers()

    for _, player in ipairs(players) do
        local playerData = player.PlayerData
        playerInventoryList[playerData.citizenid] = {
            name = playerData.charinfo.firstname .. " " .. playerData.charinfo.lastname,
            items = playerData.inventory,
            type = "player",
            slots = 30,
            maxWeight = 80000,
        }
    end
end

Citizen.CreateThread(function()
    BuildListFromDatabase()

    while true do
        OverrideConnected()

        Citizen.Wait(3000)
    end
end)

local function BuildInventoryMetrics(inventoryMetrics, name, description, type, getValue)
    local metricsString = ([[

# HELP %s %s
# TYPE %s %s
]]):format(name, description, name, type)

    for _, inventoryMetric in pairs(inventoryMetrics) do
        if inventoryMetric.type ~= "player" then
            metricsString = metricsString .. string.format([[
%s{id="%s",type="%s",label="%s",owner="%s"} %d
]], name, inventoryMetric.id, inventoryMetric.type, inventoryMetric.label, inventoryMetric.owner, getValue(inventoryMetric))
        end
    end

    for id, inventoryPlayer in pairs(playerInventoryList) do
        metricsString = metricsString .. string.format([[
%s{id="%s",type="player",label="%s",owner="%s"} %d
]], name, id, inventoryPlayer.name, id, getValue(inventoryPlayer))
    end

    return metricsString
end

function GetInventoryMetrics()
    local inventoryMetrics = exports["soz-inventory"]:GetMetrics()
    local metricsString = BuildInventoryMetrics(inventoryMetrics, "soz_inventory_slots", "Inventory slots", "gauge", function(inventoryMetric)
        return inventoryMetric.slots
    end)

    metricsString = metricsString ..
                        BuildInventoryMetrics(inventoryMetrics, "soz_inventory_total_item_count", "Total number of items in inventory", "gauge",
                                              function(inventoryMetric)
            return #inventoryMetric.items
        end)

    metricsString = metricsString .. BuildInventoryMetrics(inventoryMetrics, "soz_inventory_weight", "Inventory weight", "gauge", function(inventoryMetric)
        if inventoryMetric.type ~= "player" then
            return inventoryMetric.weight
        end

        local weight = 0

        for _, item in ipairs(inventoryMetric.items) do
            local itemDef = QBCore.Shared.Items[item.name]

            if itemDef then
                weight = weight + (itemDef.weight * item.amount)
            end
        end

        return weight
    end)

    metricsString = metricsString ..
                        BuildInventoryMetrics(inventoryMetrics, "soz_inventory_max_weight", "Max inventory weight", "gauge", function(inventoryMetric)
            return inventoryMetric.maxWeight
        end)

    metricsString = metricsString .. [[

# HELP soz_inventory_item_count Count item by inventory
# TYPE soz_inventory_item_count gauge
]]

    for _, inventoryMetric in pairs(inventoryMetrics) do
        if inventoryMetric.type ~= "player" then
            for _, item in pairs(inventoryMetric.items) do
                metricsString = metricsString .. string.format([[
soz_inventory_item_count{id="%s",type="%s",label="%s",owner="%s",item_type="%s",item_name="%s",item_label="%s"} %d
]], inventoryMetric.id, inventoryMetric.type, inventoryMetric.label, inventoryMetric.owner, item.type, item.name, item.label, item.amount)
            end
        end
    end

    for id, inventoryPlayer in pairs(playerInventoryList) do
        for _, item in pairs(inventoryPlayer.items) do
            local itemDef = QBCore.Shared.Items[item.name]

            metricsString = metricsString .. string.format([[
soz_inventory_item_count{id="%s",type="player",label="%s",owner="%s",item_type="%s",item_name="%s",item_label="%s"} %d
]], id, inventoryPlayer.name, id, item.type, item.name, itemDef.label, item.amount)
        end
    end

    return metricsString
end
