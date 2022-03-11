QBCore = exports["qb-core"]:GetCoreObject()

IsDead = false
isInHospitalBed = false
DeathTime = 0

RegisterNetEvent("soz_ems:client:KillPlayer")
AddEventHandler("soz_ems:client:KillPlayer", function()
    SetEntityHealth(PlayerPedId(), 0)
end)

RegisterNetEvent("soz_ems:client:Revive")
AddEventHandler("soz_ems:client:Revive", function()
    local player = PlayerPedId()

    if IsDead then
        local playerPos = GetEntityCoords(player, true)
        NetworkResurrectLocalPlayer(playerPos, true, true, false)
        IsDead = false
        SetEntityInvincible(player, false)
    end

    SetEntityMaxHealth(player, 200)
    SetEntityHealth(player, 200)
    ClearPedBloodDamage(player)
    SetPlayerSprint(PlayerId(), true)
    ResetAll()
    ResetPedMovementClipset(player, 0.0)

    exports["soz-hud"]:DrawNotification("Vous êtes guéri!")
end)

function ResetAll()
    IsDead = false
    DeathTime = 0
    ClearPedTasks()
    TriggerServerEvent("QBCore:Server:SetMetaData", "hunger", 100)
    TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", 100)
end
