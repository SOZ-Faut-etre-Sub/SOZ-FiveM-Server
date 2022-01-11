local prevPos = vector3(0, 0, 0)
local time = Config.secondsUntilKick
local try = 1

Citizen.CreateThread(
    function()
        while true do
            if LocalPlayer.state.isLoggedIn then
                local currentPos = GetEntityCoords(GetPlayerPed(-1), true)

                if currentPos == prevPos then
                    if time > 0 then
                        time = time - 1
                    else
                        TriggerServerEvent("afk:server:kick")
                    end
                else
                    time = Config.secondsUntilKick
                end

                prevPos = currentPos
            end

            Wait(1000)
        end
    end
)

Citizen.CreateThread(
    function()
        while true do
            if LocalPlayer.state.isLoggedIn then
                if time == Config.requestInputAt then
                    while try <= Config.retryAllowed do
                        local word = Config.wordList[math.random(#Config.wordList)]

                        local afkWord = exports["soz-hud"]:Input(
                                            ("Anti-AFK - %s/%s - Tapper le mot suivant: %s"):format(
                                                try, Config.retryAllowed, word
                                            ), 32
                                        )

                        if afkWord ~= nil and string.lower(word) == string.lower(afkWord) then
                            try, time = 1, Config.secondsUntilKick
                            exports["soz-hud"]:DrawNotification("~g~Vous n'êtes plus AFK")
                            break
                        else
                            exports["soz-hud"]:DrawNotification("~r~Mot invalide !")
                            try = try + 1
                        end
                    end
                end
            end

            Wait(500)
        end
    end
)
