-- Get all metrics about inventory
local playerInventoryList = {}
local playerInventoryListConnected = {}

local function BuildListFromDatabase()
    local players = MySQL.query.await("SELECT * FROM player WHERE is_default = 1", {})
    local newPlayerInventoryList = {}

    for _, player in pairs(players) do
        local charinfo = json.decode(player.charinfo)

        newPlayerInventoryList[player.citizenid] = {
            name = charinfo.firstname .. " " .. charinfo.lastname,
            items = json.decode(player.inventory) or {},
            type = "player",
            slots = 30,
            maxWeight = 80000,
        }
    end

    playerInventoryList = newPlayerInventoryList
end

local function OverrideConnected()
    local players = QBCore.Functions.GetQBPlayers()
    local newPlayerInventoryListConnected = {}

    for _, player in pairs(players) do
        local playerData = player.PlayerData
        newPlayerInventoryListConnected[playerData.citizenid] = {
            name = playerData.charinfo.firstname .. " " .. playerData.charinfo.lastname,
            items = playerData.items or {},
            type = "player",
            slots = 30,
            maxWeight = 80000,
        }
    end

    playerInventoryListConnected = newPlayerInventoryListConnected
end

-- Citizen.CreateThread(function()
--    while true do
--        BuildListFromDatabase()
--
--        Citizen.Wait(60 * 1000)
--    end
-- end)

-- Citizen.CreateThread(function()
--    while true do
--        OverrideConnected()
--
--        Citizen.Wait(4 * 1000)
--    end
-- end)

local function BuildInventoryMetrics(inventoryMetrics, name, description, type, getValue)
    local lines = {}
    table.insert(lines, ([[
# HELP %s %s
# TYPE %s %s
]]):format(name, description, name, type))

    for _, inventoryMetric in pairs(inventoryMetrics) do
        if inventoryMetric.type ~= "player" then
            table.insert(lines,
                         string.format("%s{id=\"%s\",type=\"%s\",label=\"%s\",owner=\"%s\"} %d", name, inventoryMetric.id, inventoryMetric.type,
                                       inventoryMetric.label, inventoryMetric.owner, getValue(inventoryMetric)))
        end
    end

    for id, inventoryPlayer in pairs(playerInventoryList) do
        if playerInventoryListConnected[id] then
            inventoryPlayer = playerInventoryListConnected[id]
        end

        table.insert(lines,
                     string.format("%s{id=\"%s\",type=\"player\",label=\"%s\",owner=\"%s\"} %d", name, id, inventoryPlayer.name, id, getValue(inventoryPlayer)))
    end

    return table.concat(lines, "\n")
end

function GetInventoryMetrics()
    local inventoryMetrics = exports["soz-inventory"]:GetMetrics()

    local lines = {
        BuildInventoryMetrics(inventoryMetrics, "soz_inventory_slots", "Inventory slots", "gauge", function(inventoryMetric)
            return inventoryMetric.slots
        end),
        BuildInventoryMetrics(inventoryMetrics, "soz_inventory_total_item_count", "Total number of items in inventory", "gauge", function(inventoryMetric)
            return #inventoryMetric.items
        end),
        BuildInventoryMetrics(inventoryMetrics, "soz_inventory_weight", "Inventory weight", "gauge", function(inventoryMetric)
            if inventoryMetric.type ~= "player" then
                return inventoryMetric.weight
            end

            local weight = 0

            for _, item in pairs(inventoryMetric.items) do
                local itemDef = QBCore.Shared.Items[item.name]

                if itemDef then
                    weight = weight + (itemDef.weight * item.amount)
                end
            end

            return weight
        end),
        BuildInventoryMetrics(inventoryMetrics, "soz_inventory_max_weight", "Max inventory weight", "gauge", function(inventoryMetric)
            return inventoryMetric.maxWeight
        end),
        [[
# HELP soz_inventory_item_count Count item by inventory
# TYPE soz_inventory_item_count gauge
]],
    }

    for _, inventoryMetric in pairs(inventoryMetrics) do
        if inventoryMetric.type ~= "player" then
            for _, item in pairs(inventoryMetric.items) do
                table.insert(lines,
                             string.format(
                                 "soz_inventory_item_count{id=\"%s\",type=\"%s\",label=\"%s\",owner=\"%s\",item_type=\"%s\",item_name=\"%s\",item_label=\"%s\"} %d",
                                 inventoryMetric.id, inventoryMetric.type, inventoryMetric.label, inventoryMetric.owner, item.type, item.name, item.label,
                                 item.amount))
            end
        end
    end

    for id, inventoryPlayer in pairs(playerInventoryList) do
        if playerInventoryListConnected[id] then
            inventoryPlayer = playerInventoryListConnected[id]
        end

        if itemsTtype == "table" then
            for _, item in pairs(inventoryPlayer.items) do
                local itemDef = QBCore.Shared.Items[item.name]

                table.insert(lines,
                             string.format(
                                 "soz_inventory_item_count{id=\"%s\",type=\"player\",label=\"%s\",owner=\"%s\",item_type=\"%s\",item_name=\"%s\",item_label=\"%s\"} %d",
                                 id, inventoryPlayer.name, id, item.type, item.name, itemDef.label, item.amount))
            end
        end
    end

    return table.concat(lines, "\n")
end
