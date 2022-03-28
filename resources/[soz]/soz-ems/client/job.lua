QBCore = exports["qb-core"]:GetCoreObject()
SozJobCore = exports["soz-jobs"]:GetCoreObject()

PlayerData = QBCore.Functions.GetPlayerData()
EmsJob = {}

onDuty = false

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

RegisterNetEvent("QBCore:Client:OnJobUpdate", function(JobInfo)
    PlayerData.job = JobInfo
end)

exports["qb-target"]:AddBoxZone("duty_lsmc", vector3(356.62, -1417.61, 32.51), 0.65, 0.5,
                                {name = "duty_lsmc", heading = 325, minZ = 32.41, maxZ = 32.61, debugPoly = false}, {
    options = {
        {
            type = "client",
            event = "lsmc:duty",
            icon = "fas fa-sign-in-alt",
            label = "Prendre son service",
            canInteract = function()
                return not PlayerData.job.onduty
            end,
            job = "lsmc",
        },
        {
            type = "client",
            event = "lsmc:duty",
            icon = "fas fa-sign-in-alt",
            label = "Finir son service",
            canInteract = function()
                return PlayerData.job.onduty
            end,
            job = "lsmc",
        },
    },
    distance = 2.5,
})

RegisterNetEvent("lsmc:duty")
AddEventHandler("lsmc:duty", function()
    TriggerServerEvent("QBCore:ToggleDuty")
end)
