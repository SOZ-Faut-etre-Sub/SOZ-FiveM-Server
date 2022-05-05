QBCore = exports["qb-core"]:GetCoreObject()
VehicleStatus = {}
OnDuty = false
PlayerJob = {}
PlayerData = {}
local effectTimer = 0

OriginalCategory = nil
OriginalMod = nil
OriginalPrimaryColour = nil
OriginalSecondaryColour = nil
OriginalPearlescentColour = nil
OriginalWheelColour = nil
OriginalDashColour = nil
OriginalInterColour = nil
OriginalWindowTint = nil
OriginalWheelCategory = nil
OriginalWheel = nil
OriginalWheelType = nil
OriginalCustomWheels = nil
OriginalNeonLightState = nil
OriginalNeonLightSide = nil
OriginalNeonColourR = nil
OriginalNeonColourG = nil
OriginalNeonColourB = nil
OriginalOldLivery = nil
OriginalPlateIndex = nil

CreateThread(function()
    local coordbennys = Config.Locations["bennys"]
    local BlipBennys = AddBlipForCoord(coordbennys.x, coordbennys.y, coordbennys.z)
    SetBlipSprite(BlipBennys, 227)
    SetBlipDisplay(BlipBennys, 4)
    SetBlipScale(BlipBennys, 1.0)
    SetBlipAsShortRange(BlipBennys, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentSubstringPlayerName("Benny's")
    EndTextCommandSetBlipName(BlipBennys)

    local coordcass = Config.Locations["cass"]
    local BlipCass = AddBlipForCoord(coordcass.x, coordcass.y, coordcass.z)
    SetBlipSprite(BlipCass, 653)
    SetBlipDisplay(BlipCass, 4)
    SetBlipScale(BlipCass, 0.8)
    SetBlipAsShortRange(BlipCass, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentSubstringPlayerName("Casse")
    EndTextCommandSetBlipName(BlipCass)
end)

local function loadAnimDict(dict)
    while (not HasAnimDictLoaded(dict)) do
        RequestAnimDict(dict)
        Wait(5)
    end
end

function ScrapAnim(time)
    local time = time / 1000
    loadAnimDict("mp_car_bomb")
    TaskPlayAnim(PlayerPedId(), "mp_car_bomb", "car_bomb_mechanic", 3.0, 3.0, -1, 16, 0, false, false, false)
    openingDoor = true
    CreateThread(function()
        while openingDoor do
            TaskPlayAnim(PlayerPedId(), "mp_car_bomb", "car_bomb_mechanic", 3.0, 3.0, -1, 16, 0, 0, 0, 0)
            Wait(2000)
            time = time - 2
            if time <= 0 then
                openingDoor = false
                StopAnimTask(PlayerPedId(), "mp_car_bomb", "car_bomb_mechanic", 1.0)
            end
        end
    end)
end

RegisterNetEvent("soz-bennys:client:RepaireeePart", function(part)
    local veh = Config.AttachedVehicle
    local plate = QBCore.Functions.GetPlate(veh)
    if part == "engine" then
        SetVehicleEngineHealth(veh, Config.MaxStatusValues[part])
        TriggerServerEvent("soz-bennys:server:updatePart", plate, "engine", Config.MaxStatusValues[part])
    elseif part == "body" then
        local enhealth = GetVehicleEngineHealth(veh)
        SetVehicleBodyHealth(veh, Config.MaxStatusValues[part])
        TriggerServerEvent("soz-bennys:server:updatePart", plate, "body", Config.MaxStatusValues[part])
        SetVehicleFixed(veh)
        SetVehicleEngineHealth(veh, enhealth)
    else
        TriggerServerEvent("soz-bennys:server:updatePart", plate, part, Config.MaxStatusValues[part])
    end
    exports["soz-hud"]:DrawNotification("Le " .. Config.ValuesLabels[part] .. " est réparé!")
end)

RegisterNetEvent("soz-bennys:client:fixEverything", function()
    if (IsPedInAnyVehicle(PlayerPedId(), false)) then
        local veh = GetVehiclePedIsIn(PlayerPedId(), false)
        if not IsThisModelABicycle(GetEntityModel(veh)) and GetPedInVehicleSeat(veh, -1) == PlayerPedId() then
            local plate = QBCore.Functions.GetPlate(veh)
            TriggerServerEvent("soz-bennys:server:fixEverything", plate)
        else
            exports["soz-hud"]:DrawNotification("You Are Not The Driver Or On A Bicycle", "error")
        end
    else
        exports["soz-hud"]:DrawNotification("You Are Not In A Vehicle", "error")
    end
end)

function GetVehicleStatusList(plate)
    local retval = nil
    if VehicleStatus[plate] ~= nil then
        retval = VehicleStatus[plate]
    end
    return retval
end

function GetVehicleStatus(plate, part)
    local retval = nil
    if VehicleStatus[plate] ~= nil then
        retval = VehicleStatus[plate][part]
    end
    return retval
end

function SetVehicleStatus(plate, part, level)
    TriggerServerEvent("soz-bennys:server:updatePart", plate, part, level)
end

exports("GetVehicleStatusList", GetVehicleStatusList)
exports("GetVehicleStatus", GetVehicleStatus)
exports("SetVehicleStatus", SetVehicleStatus)

function ApplyEffects(vehicle)
    local plate = QBCore.Functions.GetPlate(vehicle)
    if GetVehicleClass(vehicle) ~= 13 and GetVehicleClass(vehicle) ~= 21 and GetVehicleClass(vehicle) ~= 16 and GetVehicleClass(vehicle) ~= 15 and
        GetVehicleClass(vehicle) ~= 14 then
        if VehicleStatus[plate] ~= nil then
            local chance = math.random(1, 100)
            if VehicleStatus[plate]["radiator"] <= 80 and (chance >= 1 and chance <= 20) then
                local engineHealth = GetVehicleEngineHealth(vehicle)
                if VehicleStatus[plate]["radiator"] <= 80 and VehicleStatus[plate]["radiator"] >= 60 then
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(10, 15))
                elseif VehicleStatus[plate]["radiator"] <= 59 and VehicleStatus[plate]["radiator"] >= 40 then
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(15, 20))
                elseif VehicleStatus[plate]["radiator"] <= 39 and VehicleStatus[plate]["radiator"] >= 20 then
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(20, 30))
                elseif VehicleStatus[plate]["radiator"] <= 19 and VehicleStatus[plate]["radiator"] >= 6 then
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(30, 40))
                else
                    SetVehicleEngineHealth(vehicle, engineHealth - math.random(40, 50))
                end
            end

            if VehicleStatus[plate]["axle"] <= 80 and (chance >= 21 and chance <= 40) then
                if VehicleStatus[plate]["axle"] <= 80 and VehicleStatus[plate]["axle"] >= 60 then
                    for i = 0, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                elseif VehicleStatus[plate]["axle"] <= 59 and VehicleStatus[plate]["axle"] >= 40 then
                    for i = 0, 360 do
                        Wait(10)
                        SetVehicleSteeringScale(vehicle, i)
                    end
                elseif VehicleStatus[plate]["axle"] <= 39 and VehicleStatus[plate]["axle"] >= 20 then
                    for i = 0, 360 do
                        Wait(15)
                        SetVehicleSteeringScale(vehicle, i)
                    end
                elseif VehicleStatus[plate]["axle"] <= 19 and VehicleStatus[plate]["axle"] >= 6 then
                    for i = 0, 360 do
                        Wait(20)
                        SetVehicleSteeringScale(vehicle, i)
                    end
                else
                    for i = 0, 360 do
                        Wait(25)
                        SetVehicleSteeringScale(vehicle, i)
                    end
                end
            end

            if VehicleStatus[plate]["brakes"] <= 80 and (chance >= 41 and chance <= 60) then
                if VehicleStatus[plate]["brakes"] <= 80 and VehicleStatus[plate]["brakes"] >= 60 then
                    SetVehicleHandbrake(vehicle, true)
                    Wait(1000)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["brakes"] <= 59 and VehicleStatus[plate]["brakes"] >= 40 then
                    SetVehicleHandbrake(vehicle, true)
                    Wait(3000)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["brakes"] <= 39 and VehicleStatus[plate]["brakes"] >= 20 then
                    SetVehicleHandbrake(vehicle, true)
                    Wait(5000)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["brakes"] <= 19 and VehicleStatus[plate]["brakes"] >= 6 then
                    SetVehicleHandbrake(vehicle, true)
                    Wait(7000)
                    SetVehicleHandbrake(vehicle, false)
                else
                    SetVehicleHandbrake(vehicle, true)
                    Wait(9000)
                    SetVehicleHandbrake(vehicle, false)
                end
            end

            if VehicleStatus[plate]["clutch"] <= 80 and (chance >= 61 and chance <= 80) then
                if VehicleStatus[plate]["clutch"] <= 80 and VehicleStatus[plate]["clutch"] >= 60 then
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(50)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(500)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["clutch"] <= 59 and VehicleStatus[plate]["clutch"] >= 40 then
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(100)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(750)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["clutch"] <= 39 and VehicleStatus[plate]["clutch"] >= 20 then
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(150)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(1000)
                    SetVehicleHandbrake(vehicle, false)
                elseif VehicleStatus[plate]["clutch"] <= 19 and VehicleStatus[plate]["clutch"] >= 6 then
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(200)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(1250)
                    SetVehicleHandbrake(vehicle, false)
                else
                    SetVehicleHandbrake(vehicle, true)
                    SetVehicleEngineOn(vehicle, 0, 0, 1)
                    SetVehicleUndriveable(vehicle, true)
                    Wait(250)
                    SetVehicleEngineOn(vehicle, 1, 0, 1)
                    SetVehicleUndriveable(vehicle, false)
                    for i = 1, 360 do
                        SetVehicleSteeringScale(vehicle, i)
                        Wait(5)
                    end
                    Wait(1500)
                    SetVehicleHandbrake(vehicle, false)
                end
            end
        end
    end
end

RegisterNetEvent("soz-bennys:client:setVehicleStatus", function(plate, status)
    VehicleStatus[plate] = status
end)

RegisterNetEvent("soz-bennys:client:getVehicleStatus", function(plate, status)
    if not (IsPedInAnyVehicle(PlayerPedId(), false)) then
        local veh = GetVehiclePedIsIn(PlayerPedId(), true)
        if veh ~= nil and veh ~= 0 then
            local vehpos = GetEntityCoords(veh)
            local pos = GetEntityCoords(PlayerPedId())
            if #(pos - vehpos) < 5.0 then
                if not IsThisModelABicycle(GetEntityModel(veh)) then
                    local plate = QBCore.Functions.GetPlate(veh)
                    if VehicleStatus[plate] ~= nil then
                        SendStatusMessage(VehicleStatus[plate])
                    else
                        exports["soz-hud"]:DrawNotification("Etat inconnu", "error")
                    end
                else
                    exports["soz-hud"]:DrawNotification("Véhicule invalide", "error")
                end
            else
                exports["soz-hud"]:DrawNotification("Vous n'êtes pas assez proche du véhicule", "error")
            end
        else
            exports["soz-hud"]:DrawNotification("Vous devez d'abord être dans un véhicule", "error")
        end
    else
        exports["soz-hud"]:DrawNotification("Vous devez être à l'extérieur du véhicule", "error")
    end
end)

CreateThread(function()
    while true do
        Wait(1000)
        if (IsPedInAnyVehicle(PlayerPedId(), false)) then
            local veh = GetVehiclePedIsIn(PlayerPedId(), false)
            if not IsThisModelABicycle(GetEntityModel(veh)) and GetPedInVehicleSeat(veh, -1) == PlayerPedId() then
                local engineHealth = GetVehicleEngineHealth(veh)
                local bodyHealth = GetVehicleBodyHealth(veh)
                local plate = QBCore.Functions.GetPlate(veh)
                if VehicleStatus[plate] == nil then
                    TriggerServerEvent("soz-bennys:server:setupVehicleStatus", plate, engineHealth, bodyHealth)
                else
                    if VehicleStatus[plate]["engine"] ~= GetVehicleEngineHealth(veh) then
                        TriggerServerEvent("soz-bennys:server:updatePart", plate, "engine", engineHealth)
                    end
                    if VehicleStatus[plate]["body"] ~= GetVehicleBodyHealth(veh) then
                        TriggerServerEvent("soz-bennys:server:updatePart", plate, "body", bodyHealth)
                    end
                    effectTimer = effectTimer + 1
                    if effectTimer >= math.random(10, 15) then
                        ApplyEffects(veh)
                        effectTimer = 0
                    end
                end
            else
                effectTimer = 0
                Wait(1000)
            end
        else
            effectTimer = 0
            Wait(2000)
        end
    end
end)

local function UnattachVehicle()
    FreezeEntityPosition(Config.AttachedVehicle, false)
    Config.AttachedVehicle = nil
    TriggerServerEvent("soz-bennys:server:SetAttachedVehicle", false)
end

local function SpawnListVehicle(model)
    local coords = {
        x = Config.Locations["vehicle"].x,
        y = Config.Locations["vehicle"].y,
        z = Config.Locations["vehicle"].z,
        w = Config.Locations["vehicle"].w,
    }

    QBCore.Functions.SpawnVehicle(model, function(veh)
        SetVehicleNumberPlateText(veh, "ACBV" .. tostring(math.random(1000, 9999)))
        SetEntityHeading(veh, coords.w)
        exports["soz-vehicle"]:SetFuel(veh, 100.0)
        TaskWarpPedIntoVehicle(PlayerPedId(), veh, -1)
        TriggerEvent("vehiclekeys:client:SetOwner", QBCore.Functions.GetPlate(veh))
        SetVehicleEngineOn(veh, true, true)
    end, coords, true)
end

local function RepairPart(part)
    QBCore.Functions.Progressbar("repair_part", "Réparation de " .. Config.ValuesLabels[part], 10000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "mini@repair", anim = "fixing_a_ped"}, {}, {}, function() -- Done
        TriggerEvent("soz-bennys:client:RepaireeePart", part)
    end)

end

RegisterNetEvent("soz-bennys:client:UnattachVehicle", function()
    UnattachVehicle()
end)

RegisterNetEvent("soz-bennys:client:SpawnListVehicle", function(vehicleSpawnName)
    SpawnListVehicle(vehicleSpawnName)
end)

RegisterNetEvent("soz-bennys:client:CallRepairPart", function(part)
    RepairPart(part)
end)

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    QBCore.Functions.GetPlayerData(function(data)
        PlayerData = data
        PlayerJob = PlayerData.job
        if data.job.onduty then
            if data.job.id == "bennys" then
                TriggerServerEvent("QBCore:ToggleDuty")
            end
        end
    end)
    Config.AttachedVehicle = QBCore.Functions.TriggerRpc("soz-bennys:server:GetAttachedVehicle")

    QBCore.Functions.TriggerCallback("soz-bennys:server:GetDrivingDistances", function(retval)
        DrivingDistance = retval
    end)
end)

RegisterNetEvent("QBCore:Client:OnJobUpdate", function(JobInfo)
    PlayerJob = JobInfo
    OnDuty = PlayerJob.onduty
end)

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    OnDuty = duty
end)

RegisterNetEvent("soz-bennys:client:SetAttachedVehicle", function(veh)
    if veh ~= false then
        Config.AttachedVehicle = veh
    else
        Config.AttachedVehicle = nil
    end
end)

local function Repairall(entity)
    local engineHealth = GetVehicleEngineHealth(entity)
    local bodyHealth = GetVehicleBodyHealth(entity)
    if engineHealth > bodyHealth then
        engineHealth = bodyHealth
    end
    local repairTime = ((1000 - engineHealth) + (1000 - bodyHealth)) * 20

    ScrapAnim(repairTime)
    QBCore.Functions.Progressbar("repair_advanced", "Réparation du véhicule", repairTime, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "mp_car_bomb", anim = "car_bomb_mechanic", flags = 16}, {}, {}, function() -- Done
        ClearPedTasks(PlayerPedId())
        local plate = QBCore.Functions.GetPlate(entity)
        SetVehicleBodyHealth(entity, 1000.0)
        SetVehicleFixed(entity)
        SetVehicleEngineHealth(entity, 1000.0)
        TriggerServerEvent("soz-bennys:server:updatePart", plate, "body", 1000.0)
        TriggerServerEvent("soz-bennys:server:updatePart", plate, "engine", 1000.0)
    end, function() -- Cancel
        ClearPedTasks(PlayerPedId())
    end)
end

local function CleanVehicle(entity)
    local ped = PlayerPedId()
    TaskStartScenarioInPlace(ped, "WORLD_HUMAN_MAID_CLEAN", 0, true)
    QBCore.Functions.Progressbar("cleaning_vehicle", "Nettoyage du véhicule...", 10000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {}, {}, {}, function() -- Done
        exports["soz-hud"]:DrawNotification("Vehicule néttoyé!")
        SetVehicleDirtLevel(entity, 0.1)
        SetVehicleUndriveable(entity, false)
        WashDecalsFromVehicle(entity, 1.0)
        ClearAllPedProps(ped)
        ClearPedTasks(ped)
    end, function() -- Cancel
        exports["soz-hud"]:DrawNotification("Nettoyage échoué")
        ClearAllPedProps(ped)
        ClearPedTasks(ped)
    end)
end

CreateThread(function()
    exports["qb-target"]:AddGlobalVehicle({
        options = {
            {
                type = "client",
                icon = "c:mechanic/reparer.png",
                event = "soz-bennys:client:manualrepair",
                label = "Réparer",
                action = function(entity)
                    Repairall(entity)
                end,
                canInteract = function(entity, distance, data)
                    if OnDuty == false or PlayerJob.id ~= "bennys" then
                        return false
                    end
                    return true
                end,
            },
            {
                type = "client",
                icon = "c:mechanic/nettoyer.png",
                event = "qb-carwash:client:washCar",
                label = "Laver",
                action = function(entity)
                    CleanVehicle(entity)
                end,
                canInteract = function(entity, distance, data)
                    if OnDuty == false or PlayerJob.id ~= "bennys" then
                        return false
                    end
                    return true
                end,
            },
        },
        distance = 3.0,
    })
end)
