function GetNextWeather(Weather, Forecast)
    local transitions = Forecast[Weather]

    -- Safe guard to default weather if no transition found
    if transitions == nil or next(transitions) == nil then
        return "overcast"
    end

    local totalWeight = 0

    -- Calculate total weight
    for _, weight in pairs(transitions) do
        totalWeight = totalWeight + weight
    end

    -- Randomize choice
    local rnd = math.random(1, totalWeight)

    -- Go through again, to select correct transition
    for transition, weight in pairs(transitions) do
        -- select the choice if the random is below the weight of the transition
        if rnd <= weight then
            return transition
        end

        -- Remove weight for random, so we are able to select next transition if possible
        rnd = rnd - weight
    end

    -- Safe guard, should never be here
    return "overcast"
end

local CurrentWeather = "overcast"
local NextWeather = nil

RegisterCommand("soz-weather-update", function(source, args)
    -- @TODO Check if source can set weather

    -- @TODO Check if first arg is a correct weather
    local weather = args[1]

    CurrentWeather = weather
    TriggerClientEvent("soz-weather:sync", -1, CurrentWeather, NextWeather)
end, false)

RegisterCommand("soz-weather-time", function(source, args)
    -- @TODO Check if source can set weather

    -- @TODO Check if first arg is a correct weather
    currentHour = tonumber(args[1])
    currentMinute = tonumber(args[2])
    currentSecond = tonumber(args[3])

    TriggerClientEvent("soz-weather:sync-time", -1, currentHour, currentMinute, currentSecond)
end, false)

AddEventHandler("soz-weather:init", function(source)
    TriggerClientEvent("soz-weather:sync", player, CurrentWeather, NextWeather)
end)

CreateThread(function()
    while true do
        AdvanceTime()
        Wait(clockTick)
    end
end)

-- Resync time every minute for each player
CreateThread(function()
    while true do
        TriggerClientEvent("soz-weather:sync-time", -1, currentHour, currentMinute, currentSecond, dayInSeconds)
        Wait(60000)
    end
end)

CreateThread(function()
    -- Change this to switch between seasons
    Forecast = SummerForecast

    while true do
        -- Change weather in 5 to 10 minutes
        local nextWeatherDelay = math.random(5 * 60 * 1000, 10 * 60 * 1000);
        NextWeather = GetNextWeather(CurrentWeather, Forecast);
        TriggerClientEvent("soz-weather:sync", -1, CurrentWeather, NextWeather)

        Wait(nextWeatherDelay)

        CurrentWeather = NextWeather
    end
end)
