local surgery = BoxZone:Create(vector3(334.97, -1446.74, 32.51), 8.4, 6.2, {
    name = "surgery",
    heading = 320,
    debugPoly = false,
    minZ = 31.51,
    maxZ = 34.51,
})

InsideSurgery = false
Operation = nil
MissingOrgane = nil

Citizen.CreateThread(function()
    while true do
        local plyPed = PlayerPedId()
        local coord = GetEntityCoords(plyPed)
        InsideSurgery = surgery:isPointInside(coord)
        Citizen.Wait(2500)
    end
end)

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    if not duty then
        return
    end

    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Enlever un Poumon",
                color = PlayerData.job.id,
                icon = "c:ems/remove_poumon.png",
                job = {["lsmc"] = 0},
                canInteract = function(entity)
                    TriggerServerEvent("lsmc:server:Greffer", GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity)))
                    Wait(100)
                    return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "anim@gangops@morgue@table@", "body_search", 3) and InsideSurgery and Operation
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
                        TriggerServerEvent("lsmc:server:SetOrgane", id, "Poumon", true)
                    end)
                end,
            },
            {
                label = "Enlever un Rein",
                color = PlayerData.job.id,
                icon = "c:ems/remove_rein.png",
                job = {["lsmc"] = 0},
                canInteract = function(entity)
                    return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "anim@gangops@morgue@table@", "body_search", 3) and InsideSurgery and Operation
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
                        TriggerServerEvent("lsmc:server:SetOrgane", id, "Rein", true)
                    end)
                end,
            },
            {
                label = "Enlever le Foie",
                color = PlayerData.job.id,
                icon = "c:ems/remove_foie.png",
                job = {["lsmc"] = 0},
                canInteract = function(entity)
                    return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "anim@gangops@morgue@table@", "body_search", 3) and InsideSurgery and Operation
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
                        TriggerServerEvent("lsmc:server:SetOrgane", id, "Foie", true)
                    end)
                end,
            },
            {
                label = "greffer",
                color = PlayerData.job.id,
                icon = "c:ems/greffer.png",
                job = {["lsmc"] = 0},
                canInteract = function(entity)
                    return PlayerData.job.onduty and IsEntityPlayingAnim(entity, "anim@gangops@morgue@table@", "body_search", 3) and InsideSurgery and
                               not Operation
                end,
                action = function(entity)
                    QBCore.Functions.Progressbar("Soigner", "Greffer un " .. MissingOrgane, 10000, false, true,
                                                 {
                        disableMovement = true,
                        disableCarMovement = true,
                        disableMouse = false,
                        disableCombat = true,
                    }, {animDict = "mini@repair", anim = "fixing_a_ped"}, {}, {}, function()
                        local id = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity))
                        TriggerServerEvent("lsmc:server:SetOrgane", id, MissingOrgane, true)
                    end)
                end,
            },
        },
        distance = 2.5,
    })
end)

RegisterNetEvent("lsmc:client:SetOperation")
AddEventHandler("lsmc:client:SetOperation", function(val, missing)
    Operation = val
    MissingOrgane = missing
end)
