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
    local pollutionThisTick = math.ceil(QBCore.Shared.Sum(self.buffer))

    local maxNumberOfUnits = Config.Pollution.Persistence * (60 / (Config.Pollution.Tick / 60000))
    if #self.units >= maxNumberOfUnits then
        table.remove(self.units, 1)
    end

    table.insert(self.units, pollutionThisTick)

    self.currentPollution = math.ceil(QBCore.Shared.Sum(self.units) / (Config.Pollution.Persistence * 60))

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
    local currentPollution = self.currentPollution
    -- local currentPollution = 50 -- TEMP set to Neutral level for now

    if currentPollution >= 100 then
        return QBCore.Shared.Pollution.Level.High
    end

    for level, range in pairs(QBCore.Shared.Pollution.Threshold) do
        if currentPollution >= range.min and currentPollution < range.max then
            return level
        end
    end
end
