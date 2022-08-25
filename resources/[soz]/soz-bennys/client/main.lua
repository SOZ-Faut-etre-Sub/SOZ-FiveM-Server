QBCore = exports["qb-core"]:GetCoreObject()
SozJobCore = exports["soz-jobs"]:GetCoreObject()
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
    local timevar = time / 1000
    local ped = PlayerPedId()
    loadAnimDict("mp_car_bomb")
    TaskPlayAnim(ped, "mp_car_bomb", "car_bomb_mechanic", 3.0, 3.0, -1, 16, 0, false, false, false)
    local openingDoor = true
    CreateThread(function()
        while openingDoor do
            TaskPlayAnim(ped, "mp_car_bomb", "car_bomb_mechanic", 3.0, 3.0, -1, 16, 0, 0, 0, 0)
            Wait(2000)
            timevar = timevar - 2
            if timevar <= 0 then
                openingDoor = false
                StopAnimTask(ped, "mp_car_bomb", "car_bomb_mechanic", 1.0)
            end
        end
    end)
end

local function Repairall(entity)
    local engineHealth = GetVehicleEngineHealth(entity)
    local bodyHealth = GetVehicleBodyHealth(entity)
    if engineHealth > bodyHealth then
        engineHealth = bodyHealth
    end
    local repairTime = ((1000 - engineHealth) + (1000 - bodyHealth)) * 30

    ScrapAnim(repairTime)
    QBCore.Functions.Progressbar("repair_advanced", "Réparation du véhicule", repairTime, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "mp_car_bomb", anim = "car_bomb_mechanic", flags = 16}, {}, {}, function() -- Done
        exports["soz-hud"]:DrawNotification("Le véhicule est réparé!")
        ClearPedTasks(PlayerPedId())
        local plate = QBCore.Functions.GetPlate(entity)
        local serverIDcar = GetPlayerServerId(NetworkGetEntityOwner(entity))
        TriggerServerEvent("soz-bennys:server:Repair", VehToNet(entity), serverIDcar)
        TriggerServerEvent("monitor:server:event", "job_bennys_repair_vehicle", {}, {
            vehicle_plate = plate,
            vehicle_model = GetDisplayNameFromVehicleModel(GetEntityModel(entity)),
            position = GetEntityCoords(PlayerPedId()),
        }, true)
    end, function() -- Cancel
        exports["soz-hud"]:DrawNotification("Réparation échoué")
        ClearPedTasks(PlayerPedId())
    end)
end

local function CleanVehicle(entity)
    QBCore.Functions.Progressbar("cleaning_vehicle", "Nettoyage du véhicule...", 10000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {task = "WORLD_HUMAN_MAID_CLEAN"}, {}, {}, function() -- Done
        exports["soz-hud"]:DrawNotification("Le véhicule est nettoyé!")
        local serverIDcar = GetPlayerServerId(NetworkGetEntityOwner(entity))
        TriggerServerEvent("soz-bennys:server:Clean", VehToNet(entity), serverIDcar)
        TriggerServerEvent("monitor:server:event", "job_bennys_clean_vehicle", {}, {
            vehicle_plate = QBCore.Functions.GetPlate(entity),
            vehicle_model = GetDisplayNameFromVehicleModel(GetEntityModel(entity)),
            position = GetEntityCoords(PlayerPedId()),
        }, true)
    end, function() -- Cancel
        exports["soz-hud"]:DrawNotification("Nettoyage échoué")
        ClearPedTasks(PlayerPedId())
    end)
end

RegisterNetEvent("soz-bennys:client:RepairPart", function(part)
    local veh = Config.AttachedVehicle
    local plate = QBCore.Functions.GetPlate(veh)
    local serverIDcar = GetPlayerServerId(NetworkGetEntityOwner(veh))

    if part == "engine" then
        TriggerServerEvent("soz-bennys:server:EngineRepair", VehToNet(veh), serverIDcar)
    elseif part == "body" then
        TriggerServerEvent("soz-bennys:server:BodyRepair", VehToNet(veh), serverIDcar)
    elseif part == "fuel" then
        TriggerServerEvent("soz-bennys:server:FuelRepair", VehToNet(veh), serverIDcar)
    end

    TriggerServerEvent("monitor:server:event", "job_bennys_repair_vehicle_part", {vehicle_part = part}, {
        vehicle_plate = plate,
        vehicle_model = GetDisplayNameFromVehicleModel(GetEntityModel(veh)),
        position = GetEntityCoords(PlayerPedId()),
    }, true)

    exports["soz-hud"]:DrawNotification("Le " .. Config.ValuesLabels[part] .. " est réparé!")
end)

RegisterNetEvent("soz-bennys:client:repairkit", function()
    local vehicle = QBCore.Functions.GetClosestVehicle()
    Repairall(vehicle)
end)

RegisterNetEvent("soz-bennys:client:cleaningkit", function()
    local vehicle = QBCore.Functions.GetClosestVehicle()
    CleanVehicle(vehicle)
end)

function ApplyEffects(vehicle)
    if (GetVehicleClass(vehicle) >= 0 and GetVehicleClass(vehicle) <= 13) or GetVehicleClass(vehicle) == 18 or GetVehicleClass(vehicle) == 20 or
        GetVehicleClass(vehicle) == 17 then
        local speedLimit = Entity(vehicle).state.speedLimit or 0
        if speedLimit ~= 0 then
            SetVehicleMaxSpeed(vehicle, speedLimit / 3.6 - 0.25)
        else
            local maxSpeed = GetVehicleHandlingFloat(vehicle, "CHandlingData", "fInitialDriveMaxFlatVel")
            SetVehicleMaxSpeed(vehicle, maxSpeed)
            local nbrpassagers = GetVehicleNumberOfPassengers(vehicle)
            if nbrpassagers >= 1 then
                local pourcentage = 0.02 * nbrpassagers
                ModifyVehicleTopSpeed(vehicle, (1 - pourcentage))
            elseif nbrpassagers == 0 then
                ModifyVehicleTopSpeed(vehicle, 1)
            end
        end
    end
end

RegisterNetEvent("soz-bennys:client:UpdateLimiter")
AddEventHandler("soz-bennys:client:UpdateLimiter", function(speed)
    local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
    Entity(vehicle).state.speedLimit = speed
    ApplyEffects(GetVehiclePedIsIn(PlayerPedId(), false))
end)

CreateThread(function()
    while true do
        Wait(1000)
        if (IsPedInAnyVehicle(PlayerPedId(), false)) then
            local veh = GetVehiclePedIsIn(PlayerPedId(), false)
            if not IsThisModelABicycle(GetEntityModel(veh)) and GetPedInVehicleSeat(veh, -1) == PlayerPedId() then
                effectTimer = effectTimer + 1
                if effectTimer >= math.random(10, 15) then
                    ApplyEffects(veh)
                    effectTimer = 0
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
end

local function RepairPart(part)
    QBCore.Functions.Progressbar("repair_part", "Réparation de " .. Config.ValuesLabels[part], 10000, false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "mini@repair", anim = "fixing_a_ped"}, {}, {}, function() -- Done
        TriggerEvent("soz-bennys:client:RepairPart", part)
    end)
end

RegisterNetEvent("soz-bennys:client:UnattachVehicle", function()
    UnattachVehicle()
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
end)

RegisterNetEvent("QBCore:Client:OnJobUpdate", function(JobInfo)
    PlayerJob = JobInfo
    OnDuty = PlayerJob.onduty
end)

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    OnDuty = duty
end)

RegisterNetEvent("soz-bennys:client:Repair", function(net)
    local veh = NetworkGetEntityFromNetworkId(net)
    local fuel = exports["soz-vehicle"]:GetFuel(veh)
    local oil = exports["soz-vehicle"]:GetOil(veh)
    SetVehicleBodyHealth(veh, 1000.0)
    SetVehicleEngineHealth(veh, 1000.0)
    SetVehiclePetrolTankHealth(veh, 1000.0)
    SetVehicleFixed(veh)
    SetVehicleDeformationFixed(veh)
    exports["soz-vehicle"]:SetFuel(veh, fuel)
    exports["soz-vehicle"]:SetOil(veh, oil)
    local newcondition = exports["soz-vehicle"]:PropertiesToCondition(QBCore.Functions.GetVehicleProperties(veh))
    Entity(veh).state:set("condition", json.encode(newcondition), true)
end)

RegisterNetEvent("soz-bennys:client:Clean", function(net)
    local veh = NetworkGetEntityFromNetworkId(net)
    SetVehicleDirtLevel(veh, 0.1)
    SetVehicleUndriveable(veh, false)
    WashDecalsFromVehicle(veh, 1.0)
    local newcondition = exports["soz-vehicle"]:PropertiesToCondition(QBCore.Functions.GetVehicleProperties(veh))
    Entity(veh).state:set("condition", json.encode(newcondition), true)
end)

RegisterNetEvent("soz-bennys:client:EngineRepair", function(net)
    local veh = NetworkGetEntityFromNetworkId(net)
    SetVehicleEngineHealth(veh, 1000.0)
    local newcondition = exports["soz-vehicle"]:PropertiesToCondition(QBCore.Functions.GetVehicleProperties(veh))
    Entity(veh).state:set("condition", json.encode(newcondition), true)
end)

RegisterNetEvent("soz-bennys:client:BodyRepair", function(net)
    local veh = NetworkGetEntityFromNetworkId(net)
    local fuel = exports["soz-vehicle"]:GetFuel(veh)
    local oil = exports["soz-vehicle"]:GetOil(veh)
    local engineHealth = GetVehicleEngineHealth(veh)
    local petrolHealth = GetVehiclePetrolTankHealth(veh)
    SetVehicleBodyHealth(veh, 1000.0)
    SetVehicleEngineHealth(veh, 1000.0)
    SetVehicleFixed(veh)
    SetVehicleDeformationFixed(veh)
    SetVehicleEngineHealth(veh, engineHealth)
    SetVehiclePetrolTankHealth(veh, petrolHealth)
    exports["soz-vehicle"]:SetFuel(veh, fuel)
    exports["soz-vehicle"]:SetOil(veh, oil)
    local newcondition = exports["soz-vehicle"]:PropertiesToCondition(QBCore.Functions.GetVehicleProperties(veh))
    Entity(veh).state:set("condition", json.encode(newcondition), true)
end)

RegisterNetEvent("soz-bennys:client:FuelRepair", function(net)
    local veh = NetworkGetEntityFromNetworkId(net)
    SetVehiclePetrolTankHealth(veh, 1000.0)
    local newcondition = exports["soz-vehicle"]:PropertiesToCondition(QBCore.Functions.GetVehicleProperties(veh))
    Entity(veh).state:set("condition", json.encode(newcondition), true)
end)

function ScanVehicle(vehicle)
    local condition = json.decode(Entity(vehicle).state.condition)
    local enginePercent = QBCore.Shared.Round(condition.engineHealth or GetVehicleEngineHealth(vehicle) / 10, 1)
    local bodyPercent = QBCore.Shared.Round(condition.bodyHealth or GetVehicleBodyHealth(vehicle) / 10, 1)
    local tankHealth = QBCore.Shared.Round(condition.tankHealth or GetVehiclePetrolTankHealth(vehicle) / 10, 1)
    local currentFuel = QBCore.Shared.Round(Entity(vehicle).state.fuel or GetVehicleFuelLevel(vehicle), 1)
    local oilLevel = nil
    if GetVehicleHandlingFloat(vehicle, "CHandlingData", "fOilVolume") ~= 0.0 then
        oilLevel = QBCore.Shared.Round(exports["soz-vehicle"]:GetOilForHud(vehicle), 1)
    end
    if GetVehicleClassFromName(GetHashKey(GetEntityModel(vehicle))) == 13 then
        exports["soz-hud"]:DrawNotification("Moteur: " .. enginePercent .. "%")
        exports["soz-hud"]:DrawNotification("Carrosserie: " .. bodyPercent .. "%")
    else
        exports["soz-hud"]:DrawNotification("Moteur: " .. enginePercent .. "%")
        exports["soz-hud"]:DrawNotification("Carrosserie: " .. bodyPercent .. "%")
        exports["soz-hud"]:DrawNotification("Réservoir: " .. tankHealth .. "%")
        if currentFuel <= 0 then
            exports["soz-hud"]:DrawNotification("Essence restant: " .. currentFuel .. "L")
        end
        if oilLevel ~= nil then
            exports["soz-hud"]:DrawNotification("Huile: " .. oilLevel .. "%")
        end
    end
end

CreateThread(function()
    exports["qb-target"]:AddGlobalVehicle({
        options = {
            {
                type = "client",
                icon = "c:mechanic/reparer.png",
                label = "Réparer",
                color = "bennys",
                action = function(entity)
                    Repairall(entity)
                end,
                blackoutGlobal = true,
                blackoutJob = "bennys",
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
                label = "Laver",
                color = "bennys",
                blackoutGlobal = true,
                blackoutJob = "bennys",
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
            {
                type = "client",
                icon = "c:mechanic/reparer.png",
                label = "Faire un diagnostic",
                color = "bennys",
                blackoutGlobal = true,
                blackoutJob = "bennys",
                job = "bennys",
                item = "diagnostic_pad",
                action = function(vehicle)
                    ScanVehicle(vehicle)
                end,
                canInteract = function()
                    return OnDuty
                end,
            },
        },
        distance = 3.0,
    })
end)
