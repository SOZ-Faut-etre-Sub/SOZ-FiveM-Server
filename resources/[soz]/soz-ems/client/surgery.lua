Organe = nil

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    if not duty then
        return
    end
end)

local function playerHasItem(item, amount)
    for _, slot in pairs(PlayerData.items) do
        if slot.name == item then
            if amount then
                return amount <= slot.amount
            else
                return true
            end
        end
    end

    return false
end

Citizen.CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Enlever un Poumon",
                color = "lsmc",
                icon = "c:ems/remove_poumon.png",
                job = {["lsmc"] = 0},
                blackoutGlobal = true,
                blackoutJob = "lsmc",
                canInteract = function(entity)
                    local id = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                    Organe = QBCore.Functions.TriggerRpc("lsmc:server:GetCurrentOrgan", id)
                    Wait(100)
                    return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "anim@gangops@morgue@table@", "body_search", 3) and InsideSurgery and Organe ==
                               false
                end,
                action = function(entity)
                    QBCore.Functions.Progressbar("Soigner", "Enlever un Poumon..", 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {animDict = "mini@repair", anim = "fixing_a_ped"}, {}, {}, function()
                        local id = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                        TriggerServerEvent("lsmc:surgery:server:SetCurrentOrgan", "poumon", id)
                    end)
                end,
            },
            {
                label = "Enlever un Rein",
                color = "lsmc",
                icon = "c:ems/remove_rein.png",
                job = {["lsmc"] = 0},
                blackoutGlobal = true,
                blackoutJob = "lsmc",
                canInteract = function(entity)
                    return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "anim@gangops@morgue@table@", "body_search", 3) and InsideSurgery and Organe ==
                               false
                end,
                action = function(entity)
                    QBCore.Functions.Progressbar("Soigner", "Enlever un Rein..", 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {animDict = "mini@repair", anim = "fixing_a_ped"}, {}, {}, function()
                        local id = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                        TriggerServerEvent("lsmc:surgery:server:SetCurrentOrgan", "rein", id)
                    end)
                end,
            },
            {
                label = "Enlever le Foie",
                color = "lsmc",
                icon = "c:ems/remove_foie.png",
                job = {["lsmc"] = 0},
                blackoutGlobal = true,
                blackoutJob = "lsmc",
                canInteract = function(entity)
                    return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "anim@gangops@morgue@table@", "body_search", 3) and InsideSurgery and Organe ==
                               false
                end,
                action = function(entity)
                    QBCore.Functions.Progressbar("Soigner", "Enlever le Foie..", 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {animDict = "mini@repair", anim = "fixing_a_ped"}, {}, {}, function()
                        local id = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                        TriggerServerEvent("lsmc:surgery:server:SetCurrentOrgan", "foie", id)
                    end)
                end,
            },
            {
                label = "greffer",
                color = "lsmc",
                icon = "c:ems/greffer.png",
                job = {["lsmc"] = 0},
                blackoutGlobal = true,
                blackoutJob = "lsmc",
                canInteract = function(entity)
                    return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "anim@gangops@morgue@table@", "body_search", 3) and InsideSurgery and Organe ~=
                               false and playerHasItem(Organe)
                end,
                action = function(entity)
                    QBCore.Functions.Progressbar("Soigner", "Greffer un " .. Organe, 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {animDict = "mini@repair", anim = "fixing_a_ped"}, {}, {}, function()
                        TriggerServerEvent("QBCore:Server:RemoveItem", Organe, 1)
                        local id = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                        TriggerServerEvent("lsmc:surgery:server:SetCurrentOrgan", false, id)
                    end)
                end,
            },
        },
        distance = 2.5,
    })
end)
