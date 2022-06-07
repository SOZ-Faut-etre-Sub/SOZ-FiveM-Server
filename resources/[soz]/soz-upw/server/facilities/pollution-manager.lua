PollutionManager = InheritsFrom(Facility)

local pollutionLoopRunning = false

function PollutionManager:new(identifier, options)
    options.type = "pollution-manager"

    local self = PollutionManager:Super():new(identifier, options)

    self.fields_to_save = {"type", "currentPollution", "units", "buffer"}

    setmetatable(self, {__index = PollutionManager})

    return self
end

function PollutionManager:AddPollution(units)
    table.insert(self.buffer, units)
end

function PollutionManager:UpdatePollution()
    -- Handle pollution buffer
    local pollutionThisTick = math.ceil(QBCore.Shared.Sum(self.buffer))
    table.insert(self.units, pollutionThisTick)

    -- Trim buffer to max number of units
    local persistenceInMs = Config.Pollution.Persistence * 60 * 60 * 1000
    local maxNumberOfUnits = math.ceil(persistenceInMs / Config.Pollution.Tick)

    if #self.units == maxNumberOfUnits + 1 then
        table.remove(self.units, 1)

    elseif #self.units > maxNumberOfUnits + 1 then
        local newUnits = {}
        for i = maxNumberOfUnits, 0, -1 do
            table.insert(newUnits, self.units[i])
        end

        self.units = newUnits
    end

    -- Calculate current pollution percentage
    local pastUnits = math.ceil(QBCore.Shared.Sum(self.units))
    local totalMaxUnits = Config.Pollution.Persistence * Config.Pollution.MaxUnitsPerHour

    self.currentPollution = pastUnits / totalMaxUnits

    exports["soz-monitor"]:Log("INFO", "Pollution level updated: " .. self.currentPollution * 100 .. "%")

    -- Reset buffer
    self.buffer = {}
end

function PollutionManager:StartPollutionLoop()
    if pollutionLoopRunning then
        return
    end

    pollutionLoopRunning = true

    Citizen.CreateThread(function()
        local count = 0

        while pollutionLoopRunning do
            -- print("##### POLLUTION TICK #####")

            count = count + 1

            self:UpdatePollution()

            if count >= 5 then
                self:save()
                count = 0
            end

            Citizen.Wait(Config.Pollution.Tick)
        end
    end)
end

function PollutionManager:GetPollutionLevel()
    local currentPollution = self.currentPollution * 100

    if currentPollution >= 100 then
        return QBCore.Shared.Pollution.Level.High
    end

    for level, range in pairs(Config.Pollution.Threshold) do
        if currentPollution >= range.min and currentPollution < range.max then
            return level
        end
    end
end
