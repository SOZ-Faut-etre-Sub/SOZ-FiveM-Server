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
-- Add new facility from menu F10
--
local props = {
    ["prop_elecbox_02a"] = {
        model = "prop_elecbox_02a",
        facility = "terminal",
        defaults = {capacity = 0, maxCapacity = 1000, zone = {sx = 1.0, sy = 1.0, deltaZ = 2.0}},
    },
    ["prop_gnome3"] = {
        model = "prop_gnome3",
        facility = "inverter",
        defaults = {capacity = 0, maxCapacity = 1000, zone = {sx = 1.0, sy = 1.0, deltaZ = 2.0}},
    },
}
RegisterNetEvent("soz-upw:server:AddFacility", function(model, coords, scope, job)
    local propData = props[model]
    if not propData then
        error("Invalid prop : " .. model)
    end

    local facilityData = facilities[propData.facility]
    if not facilityData then
        error("Invalid facility : " .. propData.facility)
    end

    if scope and scope == "entreprise" then
        if job == nil then
            TriggerClientEvent("hud:client:DrawNotification", source, "Pas d'entreprise sélectionnée", "error")
        end
    end

    local identifier = string.format("%s%d", propData.facility, os.time())

    local zone = {
        coords = {x = coords.x, y = coords.y, z = coords.z},
        heading = coords.w,
        sx = propData.defaults.zone.sx,
        sy = propData.defaults.zone.sy,
        minZ = coords.z - propData.defaults.zone.deltaZ,
        maxZ = coords.z + propData.defaults.zone.deltaZ,
    }

    local data = {type = propData.facility, zone = zone}
    for key, value in pairs(propData.defaults) do
        if key ~= "zone" then
            data[key] = value
        end
    end
    if scope ~= nil then
        data.scope = scope
    end

    local facility = facilityData.class:new(identifier, data)
    if facility then
        facilityData.arr[identifier] = facility
    end

    TriggerClientEvent("soz-upw:client:CreateZone", -1, identifier, propData.facility, zone)
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
    metrics["pollution_level"] = {{identifier = Pm.identifier, value = Pm:GetPollutionLevel()}}

    -- Blackout Level
    metrics["blackout_level"] = {{identifier = "blackout", value = GetBlackoutLevel()}}

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
