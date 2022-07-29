QBCore = exports["qb-core"]:GetCoreObject()

local prevPos = vector3(0, 0, 0)
local time = Config.secondsUntilKick
local try = 1

Citizen.CreateThread(function()
    while true do
        local Player = QBCore.Functions.GetPlayerData()
        if LocalPlayer.state.isLoggedIn and not Player.metadata.godmode then
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
end)

Citizen.CreateThread(function()
    while true do
        if LocalPlayer.state.isLoggedIn then
            if time == Config.requestInputAt then
                while try <= Config.retryAllowed do
                    local word = Config.wordList[math.random(#Config.wordList)]

                    if exports["soz-phone"]:isPhoneVisible() then
                        exports["soz-phone"]:setPhoneFocus(false)
                    end

                    local afkWord = exports["soz-hud"]:Input(("Anti-AFK - %s/%s - Taper le mot suivant: %s"):format(try, Config.retryAllowed, word), 32)

                    if afkWord ~= nil and string.lower(word) == string.lower(afkWord) then
                        try, time = 1, Config.secondsUntilKick
                        exports["soz-hud"]:DrawNotification("Vous n'êtes plus AFK")

                        if exports["soz-phone"]:isPhoneVisible() then
                            exports["soz-phone"]:setPhoneFocus(true)
                        end

                        break
                    else
                        exports["soz-hud"]:DrawNotification("Mot invalide !", "error")
                        try = try + 1
                    end
                end
            end
        end

        Wait(500)
    end
end)
