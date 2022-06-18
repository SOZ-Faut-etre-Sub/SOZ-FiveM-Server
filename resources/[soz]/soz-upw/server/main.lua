QBCore = exports["qb-core"]:GetCoreObject()

-- UPW Objects
Plants = {}
Pm = {} -- PollutionManager instance

--
-- ON RESOURCE START
--
-- Initiate Plants
local function InitiatePlants()
    for identifier, data in pairs(Config.Plants) do
        local plant = Plant:new(identifier, data.attributes)

        Plants[identifier] = plant
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
    -- TO BE REMOVED (DEV PURPOSE)
    -- MySQL.Sync.execute("DELETE FROM upw_facility WHERE type = 'plant'")

    InitiatePollutionManager()
    Pm:StartPollutionLoop()

    InitiatePlants()
    StartProductionLoop()
end)

--
-- ON RESOURCE STOP
--
AddEventHandler("onResourceStop", function(resourceName)
    if resourceName == GetCurrentResourceName() then
        Pm:save()

        for _, plant in pairs(Plants) do
            plant:save()
        end
    end
end)

--
-- UTILS
--
function GetPlant(identifier)
    return Plants[identifier]
end
