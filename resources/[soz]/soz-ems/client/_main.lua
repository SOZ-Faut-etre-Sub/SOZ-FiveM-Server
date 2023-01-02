QBCore = exports["qb-core"]:GetCoreObject()
SozJobCore = exports["soz-jobs"]:GetCoreObject()

PlayerData = QBCore.Functions.GetPlayerData()

IsDead = false
isInHospitalBed = false
HospitalBedId = nil
DeathTime = 0
Callems = false
IsItt = false

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
    QBCore.Functions.CreateBlip("LSMC", {
        name = "Los Santos Medical Center",
        coords = vector3(356.35, -1416.63, 32.51),
        sprite = 61,
        scale = 1.0,
    })
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

RegisterNetEvent("QBCore:Client:OnJobUpdate", function(JobInfo)
    PlayerData.job = JobInfo
end)

RegisterNetEvent("soz_ems:client:KillPlayer")
AddEventHandler("soz_ems:client:KillPlayer", function()
    SetEntityHealth(PlayerPedId(), 0)
end)

RegisterNetEvent("lsmc:client:GiveBlood")
AddEventHandler("lsmc:client:GiveBlood", function()
    local player = PlayerPedId()

    TriggerServerEvent("QBCore:Server:SetMetaData", "hunger", PlayerData.metadata["hunger"] - 20)
    TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", PlayerData.metadata["thirst"] - 20)

    exports["soz-hud"]:DrawNotification("Vous avez ~g~donné~s~ votre sang !")
end)

RegisterNetEvent("lsmc:client:ifaks")
AddEventHandler("lsmc:client:ifaks", function()
    local player = PlayerPedId()
    SetEntityHealth(player, GetEntityHealth(player) + 25)
    TriggerEvent("soz-core:client:player:refresh-walk-style")
end)

RegisterNetEvent("lsmc:client:heal")
AddEventHandler("lsmc:client:heal", function(disease)
    local player = PlayerPedId()
    SetEntityHealth(player, GetEntityHealth(player) + 25)
    if disease == "grippe" then
        TriggerServerEvent("soz-core:server:server:set-current-disease", false)
        exports["soz-hud"]:DrawNotification("Vous êtes guéri!")
    end
    TriggerEvent("soz-core:client:player:refresh-walk-style")
end)
