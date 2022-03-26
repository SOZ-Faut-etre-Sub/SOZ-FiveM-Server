QBCore = exports["qb-core"]:GetCoreObject()

IsDead = false
isInHospitalBed = false
HospitalBedId = nil
DeathTime = 0

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    QBCore.Functions.CreateBlip("LSMC", {
        name = "LSMC",
        coords = vector3(356.35, -1416.63, 32.51),
        sprite = 61,
        color = 2,
        scale = 0.8,
    })
end)

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

    if isInHospitalBed == true then
        TriggerEvent("soz-ems:client:lit", HospitalBedId, false)
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
    isInHospitalBed = false
    Rhume = false
    ClearPedTasks()
    TriggerScreenblurFadeOut()
    StopScreenEffect("DeathFailOut")
    TriggerServerEvent("QBCore:Server:SetMetaData", "hunger", 100)
    TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", 100)
end

RegisterNetEvent("soz-ems:client:respawn")
AddEventHandler("soz-ems:client:respawn", function()
    player = PlayerPedId()
    for k, v in pairs(Config.Locations["lit"]) do
        if Config.Locations["lit"][k].used == false then
            HospitalBedId = k
        end
    end
    SetPedCoordsKeepVehicle(player, Config.Locations["lit"][HospitalBedId].coords.x, Config.Locations["lit"][HospitalBedId].coords.y,
                            Config.Locations["lit"][HospitalBedId].coords.z + 0.5)
    SetEntityHeading(player, 320)
    TriggerServerEvent("soz-ems:server:setLit", HospitalBedId, true)
    isInHospitalBed = true
end)

RegisterNetEvent("soz-ems:client:lit", function(id, isUsed)
    Config.Locations["lit"][id].used = isUsed
end)

RegisterNetEvent("soz-ems:client:callems")
AddEventHandler("soz-ems:client:callems", function()
    print("test")
end)
