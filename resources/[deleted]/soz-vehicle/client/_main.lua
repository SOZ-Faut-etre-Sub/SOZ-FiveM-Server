QBCore = exports["qb-core"]:GetCoreObject()

PlayerData = QBCore.Functions.GetPlayerData()
PlayerGang = {}
PlayerJob = {}
OnDuty = false

AddEventHandler("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
    PlayerGang = PlayerData.gang
    PlayerJob = PlayerData.job
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

RegisterNetEvent("QBCore:Client:OnGangUpdate", function(gang)
    PlayerGang = gang
end)

RegisterNetEvent("QBCore:Client:OnJobUpdate", function(JobInfo)
    PlayerJob = JobInfo
    OnDuty = PlayerJob.onduty
end)

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    OnDuty = duty
end)
