QBCore = exports["qb-core"]:GetCoreObject()
SozJobCore = exports["soz-jobs"]:GetCoreObject()

PlayerData = QBCore.Functions.GetPlayerData()
TaxiJob = {}

onDuty = false

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    QBCore.Functions.CreateBlip("Taxi Carl'jr", {
        name = "Taxi Carl'jr",
        coords = vector3(903.59, -158.47, 75.21),
        sprite = 198,
        color = 5,
        scale = 0.8,
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
end)

exports["qb-target"]:AddBoxZone("taxi:cloakroom", vector3(889.1, -178.53, 74.7), 0.4, 6.8,
                                {name = "taxi:cloakroom", heading = 330, minZ = 73.75, maxZ = 75.75}, {
    options = {
        {
            type = "client",
            event = "taxi:client:OpenCloakroomMenu",
            icon = "fas fa-tshirt",
            label = "Se changer",
            canInteract = function()
                return PlayerData.job.onduty
            end,
            job = {["taxi"] = 0},
        },
    },
    distance = 2.5,
})

CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Facture",
                icon = "fas fa-file-invoice-dollar",
                event = "taxi:client:InvoicePlayer",
                job = {["taxi"] = 0},
                canInteract = function()
                    return PlayerData.job.onduty
                end,
            },
        },
        distance = 2.5,
    })
end)

RegisterNetEvent("taxi:client:InvoicePlayer", function(data)
    TaxiJob.Functions.Menu.GenerateInvoiceMenu(PlayerData.job.id, data.entity)
end)