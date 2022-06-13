QBCore = exports["qb-core"]:GetCoreObject()

-- UPW Objects
Plants = {}
Inverters = {}
Pm = {} -- PollutionManager instance

--
-- ON RESOURCE START
--
local facilities = {["Plants"] = {class = Plant, arr = Plants}, ["Inverters"] = {class = Inverter, arr = Inverters}}

-- Initialize Plants, Inverters
local function InitiateFacilities()
    for configKey, data in pairs(facilities) do
        for identifier, fData in pairs(Config[configKey]) do
            local facility = data.class:new(identifier, fData.attributes)

            data.arr[identifier] = facility
        end
    end
end

local function InitiatePollutionManager()
    Pm = PollutionManager:new("pm1", {
        currentPollution = 0, -- Current pollution percent (0-100+)
        units = {},
        buffer = {},
    })
end

-- Init
MySQL.ready(function()
    local timeout = 0

    while MySQL.Sync.fetchSingle("SELECT Count(*) AS count FROM migrations WHERE name = 'add-upw-facility'").count == 0 do
        timeout = timeout + 1

        if timeout >= 10 then
            error("Migration 'add-upw-facility' is missing")
        end

        Citizen.Wait(1000)
    end

    -- TO BE REMOVED (DEV PURPOSE)
    -- MySQL.Sync.execute("DELETE FROM upw_facility WHERE type = 'plant'")

    InitiatePollutionManager()
    Pm:StartPollutionLoop()

    InitiateFacilities()
    StartProductionLoop()
end)

--
-- ON RESOURCE STOP
--
AddEventHandler("onResourceStop", function(resourceName)
    if resourceName == GetCurrentResourceName() then
        Pm:save()

        for _, data in pairs(facilities) do
            for _, facility in pairs(data.arr) do
                facility:save()
            end
        end
    end
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
