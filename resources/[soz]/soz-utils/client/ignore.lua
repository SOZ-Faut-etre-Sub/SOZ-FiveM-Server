CreateThread(function()
    while true do
        for _, sctyp in next, Config.BlacklistedScenarios["TYPES"] do
            SetScenarioTypeEnabled(sctyp, false)
        end
        for _, scgrp in next, Config.BlacklistedScenarios["GROUPS"] do
            SetScenarioGroupEnabled(scgrp, false)
        end
        Wait(10000)
    end
end)

AddEventHandler("populationPedCreating", function(x, y, z, model)
    Wait(500) -- Give the entity some time to be created
    local found, handle = GetClosestPed(x, y, z, 1.0) -- Get the entity handle
    SetPedDropsWeaponsWhenDead(handle, false)
end)

CreateThread(function() -- all these should only need to be called once
    SetPlayerHealthRechargeLimit(PlayerId(), 0)
    SetFlashLightKeepOnWhileMoving(true)
    StartAudioScene("CHARACTER_CHANGE_IN_SKY_SCENE")
    SetAudioFlag("PoliceScannerDisabled", true)
    -- SetGarbageTrucks(false)
    SetCreateRandomCops(false)
    SetCreateRandomCopsNotOnScenarios(false)
    SetCreateRandomCopsOnScenarios(false)
    DistantCopCarSirens(false)
    --[[ RemoveVehiclesFromGeneratorsInArea(335.2616 - 300.0, -1432.455 - 300.0, 46.51 - 300.0, 335.2616 + 300.0, -1432.455 + 300.0, 46.51 + 300.0) -- central los santos medical center
    RemoveVehiclesFromGeneratorsInArea(441.8465 - 500.0, -987.99 - 500.0, 30.68 - 500.0, 441.8465 + 500.0, -987.99 + 500.0, 30.68 + 500.0) -- police station mission row
    RemoveVehiclesFromGeneratorsInArea(316.79 - 300.0, -592.36 - 300.0, 43.28 - 300.0, 316.79 + 300.0, -592.36 + 300.0, 43.28 + 300.0) -- pillbox
    RemoveVehiclesFromGeneratorsInArea(-2150.44 - 500.0, 3075.99 - 500.0, 32.8 - 500.0, -2150.44 + 500.0, -3075.99 + 500.0, 32.8 + 500.0) -- military
    RemoveVehiclesFromGeneratorsInArea(-1108.35 - 300.0, 4920.64 - 300.0, 217.2 - 300.0, -1108.35 + 300.0, 4920.64 + 300.0, 217.2 + 300.0) -- nudist
    RemoveVehiclesFromGeneratorsInArea(-458.24 - 300.0, 6019.81 - 300.0, 31.34 - 300.0, -458.24 + 300.0, 6019.81 + 300.0, 31.34 + 300.0) -- police station paleto
    RemoveVehiclesFromGeneratorsInArea(1854.82 - 300.0, 3679.4 - 300.0, 33.82 - 300.0, 1854.82 + 300.0, 3679.4 + 300.0, 33.82 + 300.0) -- police station sandy
    RemoveVehiclesFromGeneratorsInArea(-724.46 - 300.0, -1444.03 - 300.0, 5.0 - 300.0, -724.46 + 300.0, -1444.03 + 300.0, 5.0 + 300.0) -- REMOVE CHOPPERS WOW
    ]]

    --- Disable LSMC heli spawn
    local helipad = vector3(305.92, -1457.84, 46.56)
    local helipadMin, helipadMax = helipad - vector3(20.0, 20.0, 5.0), helipad + vector3(20.0, 20.0, 15.0)
    if not DoesScenarioBlockingAreaExist(helipadMin, helipadMax) then
        AddScenarioBlockingArea(helipadMin, helipadMax, 0, 1, 1, 1)
    end
end)

CreateThread(function()
    SetPedPopulationBudget(3.0)
    SetVehiclePopulationBudget(3.0)
    SetAllVehicleGeneratorsActive()
end)

CreateThread(function()
    while true do
        DisablePlayerVehicleRewards(PlayerId())

        Wait(0)
    end
end)

CreateThread(function()
    while true do
        Wait(1)
        local ped = PlayerPedId()
        if IsPedBeingStunned(ped) then
            SetPedMinGroundTimeForStungun(ped, math.random(4000, 7000))
        else
            Wait(1000)
        end
    end
end)

CreateThread(function()
    for i = 1, 15 do
        EnableDispatchService(i, false)
    end

    SetMaxWantedLevel(0)
end)

CreateThread(function()
    local weaponUnarmed = GetHashKey("WEAPON_UNARMED")
    local weaponPetrolCan = GetHashKey("WEAPON_PETROLCAN")
    local weaponFireExtinguisher = GetHashKey("WEAPON_FIREEXTINGUISHER")

    while true do
        local ped = PlayerPedId()
        local weapon = GetSelectedPedWeapon(ped)
        if weapon ~= weaponUnarmed then
            if IsPedArmed(ped, 6) then
                DisableControlAction(1, 140, true)
                DisableControlAction(1, 141, true)
                DisableControlAction(1, 142, true)
            end

            if weapon == weaponPetrolCan then
                if IsPedShooting(ped) then
                    SetPedInfiniteAmmo(ped, true, weaponPetrolCan)
                end
            end

            if weapon == weaponFireExtinguisher then
                local ammo = GetAmmoInPedWeapon(ped, weaponFireExtinguisher)
                if (IsPedShooting(ped) and ammo == 0) or ammo == 0 then
                    TriggerEvent("inventory:client:StoreWeapon")
                    TriggerServerEvent("weapons:server:RemoveFireExtinguisher")
                end
            end
        else
            Wait(500)
        end
        Wait(7)
    end
end)
