QBCore = exports["qb-core"]:GetCoreObject()

-- UPW Objects
Plants = {}
Inverters = {}
Terminals = {}
Pm = {} -- PollutionManager instance

--
-- ON RESOURCE START
--
local facilities = {
    ["plant"] = {class = Plant, arr = Plants},
    ["inverter"] = {class = Inverter, arr = Inverters},
    ["terminal"] = {class = Terminal, arr = Terminals},
}

local function GetFacilitiesFromDb(types)
    local query, args = "SELECT * FROM upw_facility", nil

    if types then
        query = query .. " WHERE type IN (@types)"
        args = {["@types"] = types}
    end

    local res = MySQL.Sync.fetchAll(query, args)

    if not res then
        error("Failed to get facilities from database")
    end

    return res
end

QBCore.Functions.CreateCallback("soz-upw:server:GetFacilitiesFromDb", function(source, cb, types)
    cb(GetFacilitiesFromDb(types))
end)

-- Initialize Plants, Inverters
local function InitiateFacilities()
    local upwFacilities = GetFacilitiesFromDb({"plant", "inverter", "terminal"})

    for _, res in ipairs(upwFacilities) do
        local data = facilities[res.type]

        if data then
            local facility = data.class:new(res.identifier)

            data.arr[res.identifier] = facility
        end
    end
end

-- Init
MySQL.ready(function()
    -- TO BE REMOVED (DEV PURPOSE)
    -- MySQL.Sync.execute("DELETE FROM upw_facility WHERE type = 'plant'")

    Pm = PollutionManager:new("pm1")
    Pm:StartPollutionLoop()

    InitiateFacilities()
    StartProductionLoop()

    StartConsumptionLoop()
end)

--
-- Save all objects upon reboot
--
exports("saveUpw", function()
    for _, data in pairs(facilities) do
        for __, facility in pairs(data.arr) do
            facility:save()
        end
    end

    Pm:save()
end)

--
-- UTILS
--
function GetPlant(identifier)
    return Plants[identifier]
end

function GetInverter(identifier)
    return Inverters[identifier]
end

function GetTerminal(identifier)
    return Terminals[identifier]
end

--
-- METRICS
--
exports("GetUpwMetrics", function()
    local metrics = {}

    -- Pollution Level
    metrics["pollution-level"] = {{identifier = Pm.identifier, value = Pm:GetPollutionLevel()}}

    -- Blackout Level
    metrics["blackout-level"] = {{identifier = "blackout", value = GetBlackoutLevel()}}

    -- Facilities
    for type_, data in pairs(facilities) do
        for identifier, facility in pairs(data.arr) do
            local metric = {["identifier"] = identifier, value = facility.capacity}

            if type(metrics[type_]) == "table" then
                table.insert(metrics[type_], metric)
            else
                metrics[type_] = {metric}
            end
        end
    end

    return metrics
end)
