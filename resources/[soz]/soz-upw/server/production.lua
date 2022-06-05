local productionLoopIsRunning = false

function StartProductionLoop()
    productionLoopIsRunning = true

    local count = 0

    Citizen.CreateThread(function()
        while productionLoopIsRunning do
            print("##### PRODUCTION TICK #####")

            count = count + 1

            for _, plant in pairs(Plants) do
                if plant:CanProduce() then
                    plant:Produce()
                end

                -- Persist to DB every 5 iterations
                if count >= 5 then
                    plant:save()
                end
            end

            if count >= 5 then
                count = 0
            end

            Citizen.Wait(Config.Production.Tick)
        end
    end)
end
