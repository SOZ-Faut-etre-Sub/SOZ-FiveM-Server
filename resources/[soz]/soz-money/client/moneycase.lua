local briefcaseHash = GetHashKey("WEAPON_BRIEFCASE")

local function hasMoneyCase()
    return GetSelectedPedWeapon(PlayerPedId()) == briefcaseHash
end

local function addCase()
    GiveWeaponToPed(PlayerPedId(), briefcaseHash, 1, false, true)
    SetCurrentPedWeapon(PlayerPedId(), briefcaseHash)
end

local function removeCase()
    SetCurrentPedWeapon(PlayerPedId(), 'WEAPON_UNARMED')
    RemoveWeaponFromPed(PlayerPedId(), briefcaseHash)
end


local function GetCurrentMoney()
    local currentMoney = 0

    if PlayerData.money ~= nil then
        for k, v in pairs(PlayerData.money) do
            if k ~= 'bank' then
                currentMoney = currentMoney + v
            end
        end
    end

    return currentMoney
end


Citizen.CreateThread(function()
    while true do
        if GetCurrentMoney() >= Config.MoneyCaseTrigger then
            if not hasMoneyCase() then
                addCase()
            end
        else
            if hasMoneyCase() then
                removeCase()
            end
        end

        Wait(1000)
    end
end)

Citizen.CreateThread(function()
    while true do
        if hasMoneyCase() then
            DisableControlAction(0, 24, true) -- Attack
            DisableControlAction(0, 257, true) -- Attack 2
            DisableControlAction(0, 25, true) -- Aim
            DisableControlAction(0, 263, true) -- Melee Attack 1
            DisableControlAction(0, 45, true) -- Reload
            DisableControlAction(0, 44, true) -- Cover
            DisableControlAction(0, 37, true) -- Select Weapon
            DisableControlAction(2, 36, true) -- Disable going stealth
            DisableControlAction(0, 47, true)  -- Disable weapon
            DisableControlAction(0, 264, true) -- Disable melee
            DisableControlAction(0, 257, true) -- Disable melee
            DisableControlAction(0, 140, true) -- Disable melee
            DisableControlAction(0, 141, true) -- Disable melee
            DisableControlAction(0, 142, true) -- Disable melee
            DisableControlAction(0, 143, true) -- Disable melee
        end

        if hasMoneyCase() and IsPedInVehicle(PlayerPedId(), GetVehiclePedIsIn(PlayerPedId())) then
            removeCase()
        end

        if hasMoneyCase() and GetVehiclePedIsTryingToEnter(PlayerPedId()) ~= 0 then
            Wait(500)
            SetCurrentPedWeapon(PlayerPedId(), 'WEAPON_UNARMED')
        end

        Wait(0)
    end
end)
