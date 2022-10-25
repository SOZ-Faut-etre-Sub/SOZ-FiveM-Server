local QBCore = exports["qb-core"]:GetCoreObject()
local pedInSameVehicleLast = false
local vehicle
local lastVehicle
local vehicleClass
local fEngineDamageMult = 0.0
local healthEngineLast = 1000.0
local healthEngineCurrent = 1000.0
local healthEngineNew = 1000.0
local healthEngineDelta = 0.0
local healthEngineDeltaScaled = 0.0
local healthBodyLast = 1000.0
local healthBodyCurrent = 1000.0
local healthBodyNew = 1000.0
local healthBodyDelta = 0.0
local healthBodyDeltaScaled = 0.0
local healthPetrolTankLast = 1000.0
local healthPetrolTankCurrent = 1000.0
local healthPetrolTankNew = 1000.0
local healthPetrolTankDelta = 0.0
local healthPetrolTankDeltaScaled = 0.0
local tireBurstLuckyNumber
local tireBurstMaxNumber = cfg.randomTireBurstInterval * 1200;
if cfg.randomTireBurstInterval ~= 0 then
    tireBurstLuckyNumber = math.random(tireBurstMaxNumber)
end

local DamageComponents = {
    "radiator",
    "axle",
    "clutch",
    "fuel",
    "brakes",
}

-- Functions

local function setHealthEngineLast(newHealth)
    healthEngineLast = newHealth
end

local function setHealthPetrolTankLast(newHealth)
    healthPetrolTankLast = newHealth
end

local function setHealthBodyLast(newHealth)
    healthBodyLast = newHealth
end

exports("setHealthEngineLast", setHealthEngineLast)
exports("setHealthPetrolTankLast", setHealthPetrolTankLast)
exports("setHealthBodyLast", setHealthBodyLast)

local function DamageRandomComponent()
    local dmgFctr = math.random() + math.random(0, 2)
    local randomComponent = DamageComponents[math.random(1, #DamageComponents)]
    local randomDamage = (math.random() + math.random(0, 1)) * dmgFctr
    -- exports['qb-vehicletuning']:SetVehicleStatus(QBCore.Functions.GetPlate(vehicle), randomComponent, exports['qb-vehicletuning']:GetVehicleStatus(QBCore.Functions.GetPlate(vehicle), randomComponent) - randomDamage)
end

local function isPedDrivingAVehicle()
    local ped = PlayerPedId()
    vehicle = GetVehiclePedIsIn(ped, false)
    if IsPedInAnyVehicle(ped, false) then
        -- Check if ped is in driver seat
        if GetPedInVehicleSeat(vehicle, -1) == ped then
            local class = GetVehicleClass(vehicle)
            -- We don't want planes, helicopters, bicycles and trains
            if class ~= 15 and class ~= 16 and class ~= 21 and class ~= 13 then
                return true
            end
        end
    end
    return false
end


-- Events

RegisterNetEvent("iens:besked", function()
    exports["soz-hud"]:DrawNotification(Lang:t("error.roadside_avail"), "error")
end)

RegisterNetEvent("iens:notAllowed", function()
    exports["soz-hud"]:DrawNotification(Lang:t("error.no_permission"), "error")
end)

RegisterNetEvent("iens:repair", function()
    if isPedDrivingAVehicle() then
        local ped = PlayerPedId()
        vehicle = GetVehiclePedIsIn(ped, false)
        if IsNearMechanic() then
            return
        end
        if GetVehicleEngineHealth(vehicle) < cfg.cascadingFailureThreshold + 5 then
            if GetVehicleOilLevel(vehicle) > 0 then
                SetVehicleUndriveable(vehicle, false)
                SetVehicleEngineHealth(vehicle, cfg.cascadingFailureThreshold + 5)
                SetVehiclePetrolTankHealth(vehicle, 750.0)
                healthEngineLast = cfg.cascadingFailureThreshold + 5
                healthPetrolTankLast = 750.0
                SetVehicleEngineOn(vehicle, true, false)
                SetVehicleOilLevel(vehicle, (GetVehicleOilLevel(vehicle) / 3) - 0.5)
            else
                exports["soz-hud"]:DrawNotification(Lang:t("error.veh_damaged"), "error")
            end
        end
    else
        exports["soz-hud"]:DrawNotification(Lang:t("error.inside_veh_req"), "error")
    end
end)

-- Threads

if cfg.torqueMultiplierEnabled or cfg.preventVehicleFlip or cfg.limpMode then
    CreateThread(function()
        while true do
            Wait(0)
            if cfg.torqueMultiplierEnabled or cfg.limpMode then
                if pedInSameVehicleLast then
                    local factor = 1.0
                    if cfg.torqueMultiplierEnabled and healthEngineNew < 900 then
                        factor = (healthEngineNew + 200.0) / 1100
                    end
                    if cfg.limpMode == true and healthEngineNew < cfg.engineSafeGuard + 5 then
                        factor = cfg.limpModeMultiplier
                    end
                    SetVehicleEngineTorqueMultiplier(vehicle, factor)
                end
            end
            if cfg.preventVehicleFlip then
                local roll = GetEntityRoll(vehicle)
                if (roll > 75.0 or roll < -75.0) and GetEntitySpeed(vehicle) < 2 then
                    DisableControlAction(2, 59, true) -- Disable left/right
                    DisableControlAction(2, 60, true) -- Disable up/down
                end
            end
        end
    end)
end

CreateThread(function()
    while true do
        Wait(50)
        local ped = PlayerPedId()
        if isPedDrivingAVehicle() then
            vehicle = GetVehiclePedIsIn(ped, false)
            vehicleClass = GetVehicleClass(vehicle)
            healthEngineCurrent = GetVehicleEngineHealth(vehicle)
            if healthEngineCurrent == 1000 then
                healthEngineLast = 1000.0
            end
            healthEngineNew = healthEngineCurrent
            healthEngineDelta = healthEngineLast - healthEngineCurrent
            healthEngineDeltaScaled = healthEngineDelta * cfg.damageFactorEngine * cfg.classDamageMultiplier[vehicleClass]

            healthBodyCurrent = GetVehicleBodyHealth(vehicle)
            if healthBodyCurrent == 1000 then
                healthBodyLast = 1000.0
            end
            healthBodyNew = healthBodyCurrent
            healthBodyDelta = healthBodyLast - healthBodyCurrent
            healthBodyDeltaScaled = healthBodyDelta * cfg.damageFactorBody * cfg.classDamageMultiplier[vehicleClass]

            healthPetrolTankCurrent = GetVehiclePetrolTankHealth(vehicle)
            if cfg.compatibilityMode and healthPetrolTankCurrent < 1 then
                --	SetVehiclePetrolTankHealth(vehicle, healthPetrolTankLast)
                --	healthPetrolTankCurrent = healthPetrolTankLast
                healthPetrolTankLast = healthPetrolTankCurrent
            end
            if healthPetrolTankCurrent == 1000 then
                healthPetrolTankLast = 1000.0
            end
            healthPetrolTankNew = healthPetrolTankCurrent
            healthPetrolTankDelta = healthPetrolTankLast - healthPetrolTankCurrent
            healthPetrolTankDeltaScaled = healthPetrolTankDelta * cfg.damageFactorPetrolTank * cfg.classDamageMultiplier[vehicleClass]

            if healthEngineCurrent > cfg.engineSafeGuard + 1 then
                SetVehicleUndriveable(vehicle, false)
            end

            if healthEngineCurrent <= cfg.engineSafeGuard + 1 and cfg.limpMode == false then
                local vehpos = GetEntityCoords(vehicle)
                StartParticleFxLoopedAtCoord("ent_ray_heli_aprtmnt_l_fire", vehpos.x, vehpos.y, vehpos.z - 0.7, 0.0, 0.0, 0.0, 1.0, false, false, false, false)
                SetVehicleUndriveable(vehicle, true)
            end

            -- If ped spawned a new vehicle while in a vehicle or teleported from one vehicle to another, handle as if we just entered the car
            if vehicle ~= lastVehicle then
                pedInSameVehicleLast = false
            end

            if pedInSameVehicleLast == true then
                -- Damage happened while in the car = can be multiplied

                -- Only do calculations if any damage is present on the car. Prevents weird behavior when fixing using trainer or other script
                if healthEngineCurrent ~= 1000.0 or healthBodyCurrent ~= 1000.0 or healthPetrolTankCurrent ~= 1000.0 then

                    -- Combine the delta values (Get the largest of the three)
                    local healthEngineCombinedDelta = math.max(healthEngineDeltaScaled, healthBodyDeltaScaled, healthPetrolTankDeltaScaled)

                    -- If huge damage, scale back a bit
                    if healthEngineCombinedDelta > (healthEngineCurrent - cfg.engineSafeGuard) then
                        healthEngineCombinedDelta = healthEngineCombinedDelta * 0.7
                    end

                    -- If complete damage, but not catastrophic (ie. explosion territory) pull back a bit, to give a couple of seconds og engine runtime before dying
                    if healthEngineCombinedDelta > healthEngineCurrent then
                        healthEngineCombinedDelta = healthEngineCurrent - (cfg.cascadingFailureThreshold / 5)
                    end

                    ------- Calculate new value

                    healthEngineNew = healthEngineLast - healthEngineCombinedDelta

                    ------- Sanity Check on new values and further manipulations

                    -- If somewhat damaged, slowly degrade until slightly before cascading failure sets in, then stop

                    if healthEngineNew > (cfg.cascadingFailureThreshold + 5) and healthEngineNew < cfg.degradingFailureThreshold then
                        healthEngineNew = healthEngineNew - (0.038 * cfg.degradingHealthSpeedFactor)
                    end

                    -- If Damage is near catastrophic, cascade the failure
                    if healthEngineNew < cfg.cascadingFailureThreshold then
                        healthEngineNew = healthEngineNew - (0.1 * cfg.cascadingFailureSpeedFactor)
                    end

                    -- Prevent Engine going to or below zero. Ensures you can reenter a damaged car.
                    if healthEngineNew < cfg.engineSafeGuard then
                        healthEngineNew = cfg.engineSafeGuard
                    end

                    -- Prevent Explosions
                    if cfg.compatibilityMode == false and healthPetrolTankCurrent < 750 then
                        healthPetrolTankNew = 750.0
                    end

                    -- Prevent negative body damage.
                    if healthBodyNew < 0 then
                        healthBodyNew = 0.0
                    end
                end
            else
                -- Just got in the vehicle. Damage can not be multiplied this round
                -- Set vehicle handling data

                -- Get the CollisionDamageMultiplier
                -- Modify it by pulling all number a towards 1.0

                -- If body damage catastrophic, reset somewhat so we can get new damage to multiply
                if healthBodyCurrent < cfg.cascadingFailureThreshold then
                    healthBodyNew = cfg.cascadingFailureThreshold
                end
                pedInSameVehicleLast = true
            end

            -- set the actual new values
            if healthEngineNew ~= healthEngineCurrent then
                SetVehicleEngineHealth(vehicle, healthEngineNew)
                local dmgFactr = (healthEngineCurrent - healthEngineNew)
                if dmgFactr > 0.8 then
                    DamageRandomComponent()
                end
            end
            if healthBodyNew ~= healthBodyCurrent then
                SetVehicleBodyHealth(vehicle, healthBodyNew)
                local dmgFactr = (healthBodyCurrent - healthBodyNew)
                DamageRandomComponent()
            end
            if healthPetrolTankNew ~= healthPetrolTankCurrent then
                SetVehiclePetrolTankHealth(vehicle, healthPetrolTankNew)
            end

            -- Store current values, so we can calculate delta next time around
            healthEngineLast = healthEngineNew
            healthBodyLast = healthBodyNew
            healthPetrolTankLast = healthPetrolTankNew
            lastVehicle = vehicle
        else
            if pedInSameVehicleLast == true then
                -- We just got out of the vehicle
                lastVehicle = GetVehiclePedIsIn(ped, true)
            end
            pedInSameVehicleLast = false
        end
    end
end)
