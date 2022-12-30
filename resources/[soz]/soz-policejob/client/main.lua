QBCore = exports["qb-core"]:GetCoreObject()
SozJobCore = exports["soz-jobs"]:GetCoreObject()

PlayerData = QBCore.Functions.GetPlayerData()
PoliceJob = {}

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

RegisterNetEvent("QBCore:Client:OnJobUpdate", function(JobInfo)
    PlayerData.job = JobInfo
end)

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    PlayerData.job.onduty = duty
    if not PlayerData.job.onduty then
        TriggerEvent("soz-core:client:radar:remove-blip")
    end
end)

--- Events
AddEventHandler("police:cloakroom:openStash", function()
    TriggerServerEvent("inventory:server:openInventory", "stash", ("%s_%s"):format(PlayerData.job.id, PlayerData.citizenid))
end)

--- Blips
RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    for id, station in pairs(Config.Locations["stations"]) do
        if not QBCore.Functions.GetBlip("police_" .. id) then
            QBCore.Functions.CreateBlip("police_" .. id, {
                name = station.label,
                coords = station.coords,
                sprite = station.blip.sprite,
                scale = 1.0,
            })
        end
    end
end)
