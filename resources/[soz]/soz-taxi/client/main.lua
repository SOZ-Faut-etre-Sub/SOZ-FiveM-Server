QBCore = exports["qb-core"]:GetCoreObject()
SozJobCore = exports["soz-jobs"]:GetCoreObject()

PlayerData = QBCore.Functions.GetPlayerData()
TaxiJob = {}

onDuty = false

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    QBCore.Functions.CreateBlip("CarlJr Services", {
        name = "CarlJr Services",
        coords = vector3(903.59, -158.47, 75.21),
        sprite = 198,
        scale = 1.0,
    })
end)

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

RegisterNetEvent("QBCore:Client:OnJobUpdate", function(JobInfo)
    PlayerData.job = JobInfo
end)

exports["qb-target"]:AddBoxZone("duty_taxi", vector3(903.47, -157.88, 74.17), 1.0, 1.0,
                                {name = "duty_taxi", heading = 328, minZ = 73.97, maxZ = 74.77, debugPoly = false}, {
    options = {
        {
            type = "client",
            event = "taxi:duty",
            icon = "fas fa-sign-in-alt",
            label = "Prendre son service",
            canInteract = function()
                return not PlayerData.job.onduty
            end,
            job = {["taxi"] = 0},
        },
        {
            type = "client",
            event = "taxi:duty",
            icon = "fas fa-sign-in-alt",
            label = "Finir son service",
            canInteract = function()
                return PlayerData.job.onduty
            end,
            job = {["taxi"] = 0},
        },
    },
    distance = 2.5,
})

RegisterNetEvent("taxi:duty")
AddEventHandler("taxi:duty", function()
    TriggerServerEvent("QBCore:ToggleDuty")
    if PlayerData.job.onduty then
        ClearNpcMission()
    end
end)
