-- Variables
local QBCore = exports['qb-core']:GetCoreObject()
local PlayerData, CurrentWeaponData, CanShoot, MultiplierAmount = {}, {}, true, 0

-- Handlers

AddEventHandler('QBCore:Client:OnPlayerLoaded', function()
    PlayerData = QBCore.Functions.GetPlayerData()
    QBCore.Functions.TriggerCallback("weapons:server:GetConfig", function(RepairPoints)
        for k, data in pairs(RepairPoints) do
            Config.WeaponRepairPoints[k].IsRepairing = data.IsRepairing
            Config.WeaponRepairPoints[k].RepairingData = data.RepairingData
        end
    end)
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    for k, v in pairs(Config.WeaponRepairPoints) do
        Config.WeaponRepairPoints[k].IsRepairing = false
        Config.WeaponRepairPoints[k].RepairingData = {}
    end
end)

-- Functions

-- Events
RegisterNetEvent('weapons:client:SetCurrentWeapon', function(data, bool)
    if data ~= false then
        CurrentWeaponData = data
        TriggerServerEvent('weapons:server:SetCurrentWeaponData', CurrentWeaponData)
    else
        CurrentWeaponData = {}
        TriggerServerEvent('weapons:server:SetCurrentWeaponData', nil)
    end
    CanShoot = bool
end)

RegisterNetEvent('weapons:client:SetWeaponQuality', function(amount)
    if CurrentWeaponData and next(CurrentWeaponData) then
        TriggerServerEvent("weapons:server:SetWeaponQuality", CurrentWeaponData, amount)
    end
end)

-- Threads
CreateThread(function()
    while true do
        local ped = PlayerPedId()
        if IsPedArmed(ped, 7) == 1 and (IsControlJustReleased(0, 24) or IsDisabledControlJustReleased(0, 24)) then
            local weapon = GetSelectedPedWeapon(ped)
            local ammo = GetAmmoInPedWeapon(ped, weapon)
            TriggerServerEvent("weapons:server:UpdateWeaponAmmo", CurrentWeaponData, tonumber(ammo))
            if MultiplierAmount > 0 then
                TriggerServerEvent("weapons:server:UpdateWeaponQuality", CurrentWeaponData, MultiplierAmount)
                MultiplierAmount = 0
            end
        end
        Wait(1)
    end
end)


CreateThread(function()
    while true do
        if LocalPlayer.state.isLoggedIn then
            local ped = PlayerPedId()
            if CurrentWeaponData and next(CurrentWeaponData) then
                if IsPedShooting(ped) or IsControlJustPressed(0, 24) then
                    local weapon = GetSelectedPedWeapon(ped)
                    if CanShoot then
                        if weapon and weapon ~= 0 and QBCore.Shared.Weapons[weapon] then
                            local ammo = GetAmmoInPedWeapon(ped, weapon)
                            if QBCore.Shared.Weapons[weapon]["name"] == "weapon_snowball" then
                                TriggerServerEvent('QBCore:Server:RemoveItem', "snowball", 1)
                            elseif QBCore.Shared.Weapons[weapon]["name"] == "weapon_pipebomb" then
                                TriggerServerEvent('QBCore:Server:RemoveItem', "weapon_pipebomb", 1)
                            elseif QBCore.Shared.Weapons[weapon]["name"] == "weapon_molotov" then
                                TriggerServerEvent('QBCore:Server:RemoveItem', "weapon_molotov", 1)
                            elseif QBCore.Shared.Weapons[weapon]["name"] == "weapon_stickybomb" then
                                TriggerServerEvent('QBCore:Server:RemoveItem', "weapon_stickybomb", 1)
                            elseif QBCore.Shared.Weapons[weapon]["name"] == "weapon_grenade" then
                                TriggerServerEvent('QBCore:Server:RemoveItem', "weapon_grenade", 1)
                            elseif QBCore.Shared.Weapons[weapon]["name"] == "weapon_bzgas" then
                                TriggerServerEvent('QBCore:Server:RemoveItem', "weapon_bzgas", 1)
                            elseif QBCore.Shared.Weapons[weapon]["name"] == "weapon_proxmine" then
                                TriggerServerEvent('QBCore:Server:RemoveItem', "weapon_proxmine", 1)
                            elseif QBCore.Shared.Weapons[weapon]["name"] == "weapon_ball" then
                                TriggerServerEvent('QBCore:Server:RemoveItem', "weapon_ball", 1)
                            elseif QBCore.Shared.Weapons[weapon]["name"] == "weapon_smokegrenade" then
                                TriggerServerEvent('QBCore:Server:RemoveItem', "weapon_smokegrenade", 1)
                            elseif QBCore.Shared.Weapons[weapon]["name"] == "weapon_flare" then
                                TriggerServerEvent('QBCore:Server:RemoveItem', "weapon_flare", 1)
                            else
                                if ammo > 0 then
                                    MultiplierAmount = MultiplierAmount + 1
                                end
                            end
                        end
                    else
                        if weapon ~= -1569615261 then
                            TriggerEvent('inventory:client:CheckWeapon', QBCore.Shared.Weapons[weapon]["name"])
                            exports["soz-hud"]:DrawNotification("Cette arme n'est plus utilisable", "error")
                            MultiplierAmount = 0
                        end
                    end
                end
            end
        end
        Wait(1)
    end
end)
