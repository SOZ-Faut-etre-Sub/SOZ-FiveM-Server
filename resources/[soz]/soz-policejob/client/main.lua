QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

RegisterNetEvent("QBCore:Client:OnJobUpdate", function(JobInfo)
    PlayerData.job = JobInfo
end)

--- Targets
local cloakroomActions = {
    {
        targeticon = "fas fa-box",
        icon = "fas fa-archive",
        event = "lspd:cloakroom:openStash",
        label = "Ouvrir mon casier",
        job = "police",
    }
}

exports["qb-target"]:AddBoxZone("lspd:duty", vector3(615.900574, 15.299749, 82.797417), 0.45, 0.35, {
    name = "lspd:duty",
    heading = 58.0,
    minZ = 82.697417,
    maxZ = 82.897417,
}, {
    options = {
        {
            event = "lspd:ToggleDuty",
            icon = "fas fa-sign-in-alt",
            label = "Prise de service",
            canInteract = function()
                return not PlayerData.job.onduty
            end,
            job = "police",
        },
        {
            event = "lspd:ToggleDuty",
            icon = "fas fa-sign-out-alt",
            label = "Fin de service",
            canInteract = function()
                return PlayerData.job.onduty
            end,
            job = "police",
        },
    },
    distance = 2.5
})

CreateThread(function()
    exports["qb-target"]:AddBoxZone("lspd:cloakroom:man", vector3(626.93, 2.18, 76.63), 7.0, 8.4, {
        name="lspd:cloakroom:man",
        heading=350,
        minZ=75.62,
        maxZ=78.62,
    }, {options = cloakroomActions, distance = 2.5})

    exports["qb-target"]:AddBoxZone("lspd:cloakroom:woman", vector3(624.58, -5.48, 76.63), 6.8, 6.4, {
        name="lspd:cloakroom:woman",
        heading=350,
        minZ=75.62,
        maxZ=78.62,
    }, {options = cloakroomActions, distance = 2.5})
end)

--- Events
AddEventHandler("lspd:ToggleDuty", function()
    TriggerServerEvent("QBCore:ToggleDuty")
end)

AddEventHandler("lspd:cloakroom:openStash", function()
    TriggerServerEvent("inventory:server:openInventory", "stash", ("%s_%s"):format(PlayerData.job.id, PlayerData.citizenid))
end)
