QBCore = exports["qb-core"]:GetCoreObject()

-- UPW Objects
Plants = {}

-- Initiate Plants
local function InitiatePlants()
    for identifier, data in pairs(Config.Plants) do
        local plant = Plant:new(identifier, data.attributes)

        Plants[identifier] = plant
    end
end

-- Init
AddEventHandler("onResourceStart", function(resourceName)
    if resourceName == GetCurrentResourceName() then
        -- TO BE REMOVED
        MySQL.Sync.execute("DELETE FROM upw_facility WHERE type = 'plant'")

        InitiatePlants()

        StartProductionLoop()
    end
end)
