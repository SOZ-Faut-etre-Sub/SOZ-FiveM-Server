CreateThread(function()
    while true do
        local ped = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(ped, false)

        if IsPedInAnyVehicle(ped, false) and IsControlPressed(2, 75) and not IsEntityDead(ped) and (GetVehicleDoorLockStatus(vehicle) == 1) then
            Wait(150)
            if IsPedInAnyVehicle(ped, false) and IsControlPressed(2, 75) and not IsEntityDead(ped) and (GetVehicleDoorLockStatus(vehicle) == 1) then
                SetVehicleEngineOn(vehicle, true, true, false)
                TaskLeaveVehicle(ped, vehicle, 0)
            end
        end

        Wait(0)
    end
end)

local lastVehicle = nil

local function ShouldThisModelBeTagged(vehicle)
    local hash = GetEntityModel(vehicle)
    return IsThisModelABicycle(hash) or IsThisModelABike(hash) or IsThisModelACar(hash) or IsThisModelAHeli(hash) or IsThisModelAPlane(hash) or
               IsThisModelAQuadbike(hash) or IsThisModelATrain(hash)
end

local function CheckIsVehicleDead(vehicle)
    if ShouldThisModelBeTagged(vehicle) ~= 1 then
        return
    end
    local state = Entity(vehicle).state
    if state.isDead then
        return
    end
    if (state.deadCounter or 0) < 3 then
        if IsEntityDead(vehicle) then
            state.deadCounter = 3
        elseif IsEntityInWater(vehicle) and not GetIsVehicleEngineRunning(vehicle) then
            state.deadCounter = state.deadCounter + 1
        end
    else
        if vehicle == lastVehicle then
            lastVehicle = nil
        end
        state.isDead = true
        TriggerServerEvent("qb-garage:server:setVehicleDestroy", GetVehicleNumberPlateText(vehicle))
    end
end

CreateThread(function()
    while true do
        local ped = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(ped, false)
        if (vehicle ~= 0 and GetPedInVehicleSeat(vehicle, -1) == ped) then
            lastVehicle = vehicle
            CheckIsVehicleDead(vehicle)
        elseif lastVehicle ~= nil then
            if not DoesEntityExist(lastVehicle) then
                lastVehicle = nil
            elseif GetPedInVehicleSeat(lastVehicle, -1) == 0 then
                -- No driver in the last vehicle entered, so we keep checking the state
                CheckIsVehicleDead(lastVehicle)
            elseif GetPedInVehicleSeat(lastVehicle, -1) ~= ped then
                lastVehicle = nil
            end
        end
        Wait(1000)
    end
end)

AddEventHandler("baseevents:enteredVehicle", function()
    local model = GetEntityModel(source)
    if model == "mp_m_freemode_01" or model == "mp_f_freemode_01" then
        TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
    end
end)

AddEventHandler("baseevents:leftVehicle", function()
    local model = GetEntityModel(source)
    if model == "mp_m_freemode_01" or model == "mp_f_freemode_01" then
        TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
    end
end)
