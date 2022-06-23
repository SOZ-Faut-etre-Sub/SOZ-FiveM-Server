local QBCore = exports["qb-core"]:GetCoreObject()

--- Setup global state values
GlobalState.blackout = GlobalState.blackout or false
GlobalState.weather = GlobalState.weather or "overcast"
GlobalState.time = GlobalState.time or {02, 00, 00}

--- In memory time
local currentHour, currentMinute, currentSecond = 02, 00, 00
--- How many seconds in real time to do 24h in GTA
local incrementSeconds = (3600 * 24) / (60 * 48)
--- Option to disable weather updates
local weatherUpdate = true

function AdvanceTime()
    currentSecond = currentSecond + incrementSeconds

    if currentSecond >= 60 then
        incrementMinutes = math.floor((currentSecond / 60) + 0.5)
        currentMinute = currentMinute + incrementMinutes
        currentSecond = currentSecond % 60

        if currentMinute >= 60 then
            incrementHours = math.floor((currentMinute / 60) + 0.5)
            currentMinute = currentMinute % 60
            currentHour = currentHour + incrementHours

            if currentHour >= 24 then
                currentHour = currentHour % 24
            end
        end
    end

    GlobalState.time = {currentHour, currentMinute, currentSecond}
end

---Apply multiplier to forecast weight based on Pollution level
function WeightForecast(forecast)
    local pollutionLevel = QBCore.Functions.TriggerRpc("soz-upw:server:GetPollutionLevel", nil)

    -- Awful forecast on Pollution level High
    if pollutionLevel == QBCore.Shared.Pollution.Level.Neutral then
        local weathers = {
            "extrasunny",
            "clear",
            "neutral",
            "smog",
            "foggy",
            "overcast",
            "clouds",
            "clearing",
            "rain",
            "thunder",
            "snow",
            "blizzard",
            "snowlight",
            "xmas",
            "halloween",
        }

        local awfulForecast = {}

        for _, weather in ipairs(weathers) do
            awfulForecast[weather] = {["smog"] = 80, ["foggy"] = 20}
        end

        return awfulForecast
    end

    -- Weighted forecast
    local AllMultipliers = {
        [QBCore.Shared.Pollution.Level.Low] = {["extrasunny"] = 2, ["smog"] = 0, ["foggy"] = 0, ["any"] = 0.75},
        [QBCore.Shared.Pollution.Level.Neutral] = {["any"] = 1},
    }

    local multipliers = AllMultipliers[pollutionLevel]
    if not multipliers then
        return forecast
    end

    local weightedForecast = {}
    for weather, transitions in pairs(forecast) do
        if type(weightedForecast[weather]) ~= "table" then
            weightedForecast[weather] = {}
        end

        for nextWeather, weight in pairs(transitions) do
            local multiplier = multipliers["any"] or 1

            if multipliers[nextWeather] then
                multiplier = multipliers[nextWeather]
            end

            weightedForecast[weather][nextWeather] = math.ceil(weight * multiplier)
        end
    end

    return weightedForecast
end

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
    local rnd = math.random(totalWeight)

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

--- Commands
QBCore.Commands.Add("weather", "Changer la météo", {
    {name = "type", help = "Type de météo valide : " .. table.concat(Config.WeatherType, ", ")},
}, true, function(source, args)
    for _, weather in pairs(Config.WeatherType) do
        if weather:lower() == args[1]:lower() then
            GlobalState.weather = weather:lower()
            TriggerClientEvent("hud:client:DrawNotification", source, "Météo mise à jour", "info")

            return
        end
    end

    TriggerClientEvent("hud:client:DrawNotification", source, "Type de météo invalide : " .. args[1], "error")
end, "admin")

QBCore.Commands.Add("time", "Changer l'heure", {{name = "heure", help = "Heure"}, {name = "minute", help = "Minute"}}, true, function(source, args)
    local hour = tonumber(args[1])
    local minute = tonumber(args[2])

    if hour >= 0 and hour <= 23 and minute >= 0 and minute <= 59 then
        GlobalState.time = {hour, minute, 0}
        currentHour, currentMinute = hour, minute
    else
        TriggerClientEvent("hud:client:DrawNotification", source, "Paramètre invalide", "error")
    end
end, "admin")

QBCore.Commands.Add("blackout", "Mettre la ville dans le noir", {{name = "status", help = "on = no power, off = power"}}, true, function(source, args)
    if args[1] == "on" or args[1] == "off" then
        GlobalState.blackout = args[1] == "on"
        TriggerClientEvent("hud:client:DrawNotification", source, "État de l'électricité mis à jour", "info")
    else
        TriggerClientEvent("hud:client:DrawNotification", source, "Valeur de blackout invalide : " .. args[1], "error")
    end
end, "admin")

--- Exports
exports("setWeatherUpdate", function(state)
    weatherUpdate = state
end)

--- Threads
CreateThread(function()
    while true do
        AdvanceTime()
        Wait(1000)
    end
end)

CreateThread(function()
    -- Change this to switch between seasons
    Forecast = WeightForecast(SummerForecast)

    while true do
        -- Change weather in 10 to 15 minutes
        Wait(math.random(10 * 60 * 1000, 15 * 60 * 1000))

        if weatherUpdate then
            GlobalState.weather = GetNextWeather(GlobalState.weather, Forecast)
        end
    end
end)
