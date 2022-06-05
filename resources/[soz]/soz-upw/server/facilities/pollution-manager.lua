PollutionManager = InheritsFrom(Facility)

function PollutionManager:new(identifier, options)
    options.type = "pollution-manager"

    local self = PollutionManager:Super():new(identifier, options)

    self.fields_to_save = {"type", "loopRunning", "currentPollution", "units", "buffer"}

    setmetatable(self, {__index = PollutionManager})

    return self
end

function PollutionManager:AddPollution(units)
    table.insert(PollutionManager.buffer, units)
end

function PollutionManager:UpdatePollution()
    local pollutionThisTick = QBCore.Shared.Sum(self.buffer)

    local maxNumberOfUnits = Config.Pollution.MaxUnitsPerHour * Config.Pollution.Persistence / (Config.Pollution.Tick / 1000)
    if #self.units >= maxNumberOfUnits then
        table.remove(self.units, 1)
    end

    table.insert(self.units, pollutionThisTick)
end

function PollutionManager:StartPollutionLoop()
    if self.loopRunning then
        return
    end

    self.loopRunning = true

    Citizen.CreateThread(function()
        local count = 0

        while self.loopRunning do
            print("##### POLLUTION TICK #####")

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
    -- local currentPollution = currentPollution
    local currentPollution = 50 -- TEMP set to Neutral level for now

    if currentPollution >= 100 then
        return QBCore.Shared.Pollution.Level.High
    end

    for level, range in pairs(QBCore.Shared.Pollution.Threshold) do
        if currentPollution >= range.min and currentPollution < range.max then
            return level
        end
    end
end
