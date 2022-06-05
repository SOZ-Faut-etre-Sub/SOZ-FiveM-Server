QBCore = exports["qb-core"]:GetCoreObject()

-- UPW Objects
Plants = {}
Pm = {} -- PollutionManager instance

-- Initiate Plants
local function InitiatePlants()
    for identifier, data in pairs(Config.Plants) do
        local plant = Plant:new(identifier, data.attributes)

        Plants[identifier] = plant
    end
end

local function InitiatePollutionManager()
    Pm = PollutionManager:new("pm1", {
        loopRunning = false,
        currentPollution = 0, -- Current pollution percent (0-100+)
        units = {},
        buffer = {},
    })
end

-- Init
AddEventHandler("onResourceStart", function(resourceName)
    if resourceName == GetCurrentResourceName() then
        -- TO BE REMOVED
        MySQL.Sync.execute("DELETE FROM upw_facility WHERE type = 'plant'")

        InitiatePlants()
        InitiatePollutionManager()

        StartProductionLoop()
        Pm:StartPollutionLoop()
    end
end)
