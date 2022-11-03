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

RegisterNetEvent("soz-bennys:client:CallRepairPart", function(part)
    RepairPart(part)
end)

