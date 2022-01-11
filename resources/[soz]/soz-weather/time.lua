currentHour = 12
currentMinute = 00
currentSecond = 00

-- How many seconds in real time to do 24h in GTA
dayInSeconds = 1800
clockTick = 1000
incrementSeconds = ((3600 * 24) / dayInSeconds) / (1000 / clockTick)

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
end
