QBCore = exports["qb-core"]:GetCoreObject()

IsDead = false
isInHospitalBed = false
HospitalBedId = nil
DeathTime = 0
Callems = false

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    QBCore.Functions.CreateBlip("LSMC", {
        name = "Los Santos Medical Center",
        coords = vector3(356.35, -1416.63, 32.51),
        sprite = 61,
        scale = 1.0,
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
        SetBlockingOfNonTemporaryEvents(player, false)
        IsEntityStatic(player, false)
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

RegisterNetEvent("lsmc:client:GiveBlood")
AddEventHandler("lsmc:client:GiveBlood", function()
    local player = PlayerPedId()

    TriggerServerEvent("QBCore:Server:SetMetaData", "hunger", QBCore.Functions.GetPlayerData().metadata["hunger"] - 20)
    TriggerServerEvent("QBCore:Server:SetMetaData", "hunger", QBCore.Functions.GetPlayerData().metadata["thirst"] - 20)

    exports["soz-hud"]:DrawNotification("Vous avez donnez votre sang!")
end)

function ResetAll()
    IsDead = false
    DeathTime = 0
    isInHospitalBed = false
    Callems = false

    Rhume = false
    Grippe = false
    Dos = false
    Rougeur = false
    Intoxication = false

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
    TriggerServerEvent("npwd:sendSocietyMessage", "npwd:sendSocietyMessage:" .. QBCore.Shared.UuidV4(), {
        anonymous = true,
        number = "555-LSMC",
        message = ("Besoin d'aide vers %s"):format(GetStreetNameFromHashKey(street)),
        position = true,
    })
end)

RegisterNetEvent("lsmc:client:ifaks")
AddEventHandler("lsmc:client:ifaks", function()
    local player = PlayerPedId()
    SetEntityHealth(player, GetEntityHealth(player) + 25)
end)
