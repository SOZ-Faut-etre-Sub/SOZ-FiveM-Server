local weapons = {
    "WEAPON_ADVANCEDRIFLE",
    "WEAPON_APPISTOL",
    "WEAPON_ASSAULTRIFLE",
    "WEAPON_ASSAULTRIFLE_MK2",
    "WEAPON_ASSAULTSHOTGUN",
    "WEAPON_ASSAULTSMG",
    "WEAPON_AUTOSHOTGUN",
    "WEAPON_BAT",
    "WEAPON_BATTLEAXE",
    "WEAPON_BOTTLE",
    "WEAPON_BREAD",
    "WEAPON_BULLPUPRIFLE",
    "WEAPON_BULLPUPRIFLE_MK2",
    "WEAPON_BULLPUPSHOTGUN",
    "WEAPON_BZGAS",
    "WEAPON_CARBINERIFLE",
    "WEAPON_CARBINERIFLE_MK2",
    "WEAPON_CERAMICPISTOL",
    "WEAPON_COMBATMG",
    "WEAPON_COMBATMG_MK2",
    "WEAPON_COMBATPDW",
    "WEAPON_COMBATPISTOL",
    "WEAPON_COMBATSHOTGUN",
    "WEAPON_COMPACTLAUNCHER",
    "WEAPON_COMPACTRIFLE",
    "WEAPON_CROWBAR",
    "WEAPON_DAGGER",
    "WEAPON_DBSHOTGUN",
    "WEAPON_DIGISCANNER",
    "WEAPON_DOUBLEACTION",
    "WEAPON_EMPLAUNCHER",
    "WEAPON_FIREWORK",
    "WEAPON_FLAREGUN",
    "WEAPON_FLASHLIGHT",
    "WEAPON_GADGETPISTOL",
    "WEAPON_GOLFCLUB",
    "WEAPON_GRENADE",
    "WEAPON_GRENADELAUNCHER",
    "WEAPON_GRENADELAUNCHER_SMOKE",
    "WEAPON_GUSENBERG",
    "WEAPON_HAMMER",
    "WEAPON_HATCHET",
    "WEAPON_HEAVYPISTOL",
    "WEAPON_HEAVYRIFLE",
    "WEAPON_HEAVYSHOTGUN",
    "WEAPON_HEAVYSNIPER",
    "WEAPON_HEAVYSNIPER_MK2",
    "WEAPON_HOMINGLAUNCHER",
    "WEAPON_KNIFE",
    "WEAPON_KNUCKLE",
    "WEAPON_MACHETE",
    "WEAPON_MACHINEPISTOL",
    "WEAPON_MARKSMANPISTOL",
    "WEAPON_MARKSMANRIFLE",
    "WEAPON_MARKSMANRIFLE_MK2",
    "WEAPON_MG",
    "WEAPON_MICROSMG",
    "WEAPON_MILITARYRIFLE",
    "WEAPON_MINIGUN",
    "WEAPON_MINISMG",
    "WEAPON_MOLOTOV",
    "WEAPON_MUSKET",
    "WEAPON_NAVYREVOLVER",
    "WEAPON_NIGHTSTICK",
    "WEAPON_PIPEBOMB",
    "WEAPON_PISTOL",
    "WEAPON_PISTOL50",
    "WEAPON_PISTOL_MK2",
    "WEAPON_POOLCUE",
    "WEAPON_PRECISIONRIFLE",
    "WEAPON_PROXMINE",
    "WEAPON_PUMPSHOTGUN",
    "WEAPON_PUMPSHOTGUN_MK2",
    "WEAPON_RAILGUN",
    "WEAPON_RAYCARBINE",
    "WEAPON_RAYPISTOL",
    "WEAPON_REVOLVER",
    "WEAPON_REVOLVER_MK2",
    "WEAPON_RPG",
    "WEAPON_SAWNOFFSHOTGUN",
    "WEAPON_SMG",
    "WEAPON_SMG_MK2",
    "WEAPON_SMOKEGRENADE",
    "WEAPON_SNIPERRIFLE",
    "WEAPON_SNSPISTOL",
    "WEAPON_SNSPISTOL_MK2",
    "WEAPON_SPECIALCARBINE",
    "WEAPON_SPECIALCARBINE_MK2",
    "WEAPON_STICKYBOMB",
    "WEAPON_STINGER",
    "WEAPON_STUNGUN",
    "WEAPON_SWITCHBLADE",
    "WEAPON_VINTAGEPISTOL",
    "WEAPON_WRENCH",
}

-- Wheapons that require the Police holster animation
local holsterableWeapons = {
    -- 'WEAPON_STUNGUN',
    "WEAPON_PISTOL",
    "WEAPON_PISTOL_MK2",
    "WEAPON_COMBATPISTOL",
    "WEAPON_APPISTOL",
    "WEAPON_PISTOL50",
    "WEAPON_REVOLVER",
    "WEAPON_REVOLVER_MK2",
    "WEAPON_SNSPISTOL",
    "WEAPON_HEAVYPISTOL",
    "WEAPON_VINTAGEPISTOL",
}

local holstered = true
local canFire = true
local currWeapon = GetHashKey("WEAPON_UNARMED")
local currentHoldster = nil

RegisterNetEvent("weapons:ResetHolster", function()
    holstered = true
    canFire = true
    currWeapon = GetHashKey("WEAPON_UNARMED")
    currentHoldster = nil
end)

CreateThread(function()
    while true do
        local ped = PlayerPedId()
        if DoesEntityExist(ped) and not IsEntityDead(ped) and not IsPedInParachuteFreeFall(ped) and not IsPedFalling(ped) and
            (GetPedParachuteState(ped) == -1 or GetPedParachuteState(ped) == 0) then
            if currWeapon ~= GetSelectedPedWeapon(ped) then
                pos = GetEntityCoords(ped, true)
                rot = GetEntityHeading(ped)

                local newWeap = GetSelectedPedWeapon(ped)
                QBCore.Functions.RequestAnimDict("reaction@intimidation@1h")
                QBCore.Functions.RequestAnimDict("reaction@intimidation@cop@unarmed")
                QBCore.Functions.RequestAnimDict("rcmjosh4")
                QBCore.Functions.RequestAnimDict("weapons@pistol@")
                if CheckWeapon(newWeap) then
                    SetCurrentPedWeapon(ped, currWeapon, true)
                    if holstered then
                        LocalPlayer.state:set("weapon_animation", true, true);
                        if QBCore.Functions.GetPlayerData().job.id == "police" then
                            -- TaskPlayAnim(ped, "rcmjosh4", "josh_leadout_cop2", 8.0, 2.0, -1, 48, 10, 0, 0, 0 )
                            canFire = false
                            currentHoldster = GetPedDrawableVariation(ped, 7)
                            TaskPlayAnimAdvanced(ped, "rcmjosh4", "josh_leadout_cop2", GetEntityCoords(ped, true), 0, 0, rot, 3.0, 3.0, -1, 50, 0, 0, 0)
                            Wait(300)
                            SetCurrentPedWeapon(ped, newWeap, true)

                            if IsWeaponHolsterable(newWeap) then
                                if currentHoldster == 8 then
                                    SetPedComponentVariation(ped, 7, 2, 0, 2)
                                elseif currentHoldster == 1 then
                                    SetPedComponentVariation(ped, 7, 3, 0, 2)
                                elseif currentHoldster == 6 then
                                    SetPedComponentVariation(ped, 7, 5, 0, 2)
                                end
                            end
                            currWeapon = newWeap
                            Wait(300)
                            ClearPedTasks(ped)
                            holstered = false
                            canFire = true
                        else
                            canFire = false
                            TaskPlayAnimAdvanced(ped, "reaction@intimidation@1h", "intro", GetEntityCoords(ped, true), 0, 0, rot, 8.0, 3.0, -1, 50, 0, 0, 0)
                            Wait(1000)
                            SetCurrentPedWeapon(ped, newWeap, true)
                            currWeapon = newWeap
                            Wait(1400)
                            ClearPedTasks(ped)
                            holstered = false
                            canFire = true
                        end
                        LocalPlayer.state:set("weapon_animation", false, true);
                    elseif newWeap ~= currWeapon and CheckWeapon(currWeapon) then
                        LocalPlayer.state:set("weapon_animation", true, true);
                        if QBCore.Functions.GetPlayerData().job.id == "police" then
                            canFire = false

                            TaskPlayAnimAdvanced(ped, "reaction@intimidation@cop@unarmed", "intro", GetEntityCoords(ped, true), 0, 0, rot, 3.0, 3.0, -1, 50, 0,
                                                 0, 0)
                            Wait(500)

                            if IsWeaponHolsterable(currWeapon) then
                                SetPedComponentVariation(ped, 7, currentHoldster, 0, 2)
                            end

                            SetCurrentPedWeapon(ped, GetHashKey("WEAPON_UNARMED"), true)
                            currentHoldster = GetPedDrawableVariation(ped, 7)

                            TaskPlayAnimAdvanced(ped, "rcmjosh4", "josh_leadout_cop2", GetEntityCoords(ped, true), 0, 0, rot, 3.0, 3.0, -1, 50, 0, 0, 0)
                            Wait(300)
                            SetCurrentPedWeapon(ped, newWeap, true)

                            if IsWeaponHolsterable(newWeap) then
                                if currentHoldster == 8 then
                                    SetPedComponentVariation(ped, 7, 2, 0, 2)
                                elseif currentHoldster == 1 then
                                    SetPedComponentVariation(ped, 7, 3, 0, 2)
                                elseif currentHoldster == 6 then
                                    SetPedComponentVariation(ped, 7, 5, 0, 2)
                                end
                            end

                            Wait(500)
                            currWeapon = newWeap
                            ClearPedTasks(ped)
                            holstered = false
                            canFire = true
                        else
                            canFire = false
                            TaskPlayAnimAdvanced(ped, "reaction@intimidation@1h", "outro", GetEntityCoords(ped, true), 0, 0, rot, 8.0, 3.0, -1, 50, 0, 0, 0)
                            Wait(1600)
                            SetCurrentPedWeapon(ped, GetHashKey("WEAPON_UNARMED"), true)
                            TaskPlayAnimAdvanced(ped, "reaction@intimidation@1h", "intro", GetEntityCoords(ped, true), 0, 0, rot, 8.0, 3.0, -1, 50, 0, 0, 0)
                            Wait(1000)
                            SetCurrentPedWeapon(ped, newWeap, true)
                            currWeapon = newWeap
                            Wait(1400)
                            ClearPedTasks(ped)
                            holstered = false
                            canFire = true
                        end
                        LocalPlayer.state:set("weapon_animation", false, true);
                    else
                        LocalPlayer.state:set("weapon_animation", true, true);
                        if QBCore.Functions.GetPlayerData().job.id == "police" then
                            SetCurrentPedWeapon(ped, GetHashKey("WEAPON_UNARMED"), true)
                            currentHoldster = GetPedDrawableVariation(ped, 7)
                            TaskPlayAnimAdvanced(ped, "rcmjosh4", "josh_leadout_cop2", GetEntityCoords(ped, true), 0, 0, rot, 3.0, 3.0, -1, 50, 0, 0, 0)
                            Wait(300)
                            SetCurrentPedWeapon(ped, newWeap, true)

                            if IsWeaponHolsterable(newWeap) then
                                if currentHoldster == 8 then
                                    SetPedComponentVariation(ped, 7, 2, 0, 2)
                                elseif currentHoldster == 1 then
                                    SetPedComponentVariation(ped, 7, 3, 0, 2)
                                elseif currentHoldster == 6 then
                                    SetPedComponentVariation(ped, 7, 5, 0, 2)
                                end
                            end

                            currWeapon = newWeap
                            Wait(300)
                            ClearPedTasks(ped)
                            holstered = false
                            canFire = true
                        else
                            SetCurrentPedWeapon(ped, GetHashKey("WEAPON_UNARMED"), true)
                            TaskPlayAnimAdvanced(ped, "reaction@intimidation@1h", "intro", GetEntityCoords(ped, true), 0, 0, rot, 8.0, 3.0, -1, 50, 0, 0, 0)
                            Wait(1000)
                            SetCurrentPedWeapon(ped, newWeap, true)
                            currWeapon = newWeap
                            Wait(1400)
                            ClearPedTasks(ped)
                            holstered = false
                            canFire = true
                        end
                        LocalPlayer.state:set("weapon_animation", false, true);
                    end
                elseif newWeap == GetHashKey("WEAPON_UNARMED") then
                    LocalPlayer.state:set("weapon_animation", true, true);
                    if not holstered and CheckWeapon(currWeapon) then
                        if QBCore.Functions.GetPlayerData().job.id == "police" then
                            canFire = false
                            TaskPlayAnimAdvanced(ped, "reaction@intimidation@cop@unarmed", "intro", GetEntityCoords(ped, true), 0, 0, rot, 3.0, 3.0, -1, 50, 0,
                                                 0, 0)
                            Wait(500)

                            if IsWeaponHolsterable(currWeapon) then
                                SetPedComponentVariation(ped, 7, currentHoldster, 0, 2)
                            end

                            SetCurrentPedWeapon(ped, GetHashKey("WEAPON_UNARMED"), true)
                            ClearPedTasks(ped)
                            SetCurrentPedWeapon(ped, newWeap, true)
                            holstered = true
                            canFire = true
                            currWeapon = newWeap
                        else
                            canFire = false
                            TaskPlayAnimAdvanced(ped, "reaction@intimidation@1h", "outro", GetEntityCoords(ped, true), 0, 0, rot, 8.0, 3.0, -1, 50, 0, 0, 0)
                            Wait(1400)
                            SetCurrentPedWeapon(ped, GetHashKey("WEAPON_UNARMED"), true)
                            ClearPedTasks(ped)
                            SetCurrentPedWeapon(ped, newWeap, true)
                            holstered = true
                            canFire = true
                            currWeapon = newWeap
                        end
                    else
                        SetCurrentPedWeapon(ped, newWeap, true)
                        holstered = false
                        canFire = true
                        currWeapon = newWeap
                    end
                    LocalPlayer.state:set("weapon_animation", false, true);
                end
            end
        else
            Wait(250)
        end

        Wait(5)
    end
end)

CreateThread(function()
    while true do
        if not canFire then
            DisableControlAction(0, 25, true)
            DisablePlayerFiring(PlayerPedId(), true)
        else
            Wait(250)
        end

        Wait(3)
    end
end)

function CheckWeapon(newWeap)
    for i = 1, #weapons do
        if GetHashKey(weapons[i]) == newWeap then
            return true
        end
    end
    return false
end

function IsWeaponHolsterable(weap)
    for i = 1, #holsterableWeapons do
        if GetHashKey(holsterableWeapons[i]) == weap then
            return true
        end
    end
    return false
end
