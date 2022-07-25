local PlayWalking = function(animation)
    RequestAnimSet(animation)
    while not HasAnimSetLoaded(animation) do
        Wait(1)
    end

    SetPedMovementClipset(PlayerPedId(), animation, 1)
    RemoveAnimSet(animation)
end

--- Effects
RegisterNetEvent("QBCore:Player:SetPlayerData", function(PlayerData)
    if PlayerData.metadata["drug"] > 0 and not AnimpostfxIsRunning("DrugsMichaelAliensFight") then
        AnimpostfxPlay("DrugsMichaelAliensFightIn", 0, false)
        AnimpostfxPlay("DrugsMichaelAliensFight", 0, true)
    elseif PlayerData.metadata["drug"] <= 0 and AnimpostfxIsRunning("DrugsMichaelAliensFight") then
        AnimpostfxStopAndDoUnk("DrugsMichaelAliensFight")
        AnimpostfxStopAndDoUnk("DrugsMichaelAliensFightIn")
    end

    if PlayerData.metadata["alcohol"] > 0 and not AnimpostfxIsRunning("DrugsTrevorClownsFight") then
        AnimpostfxPlay("DrugsTrevorClownsFightIn", 0, false)
        AnimpostfxPlay("DrugsTrevorClownsFight", 0, true)
    elseif PlayerData.metadata["alcohol"] <= 0 and AnimpostfxIsRunning("DrugsTrevorClownsFight") then
        AnimpostfxStopAndDoUnk("DrugsTrevorClownsFight")
        AnimpostfxStopAndDoUnk("DrugsTrevorClownsFightIn")
    end

    if PlayerData.metadata["alcohol"] > 80 or PlayerData.metadata["drug"] > 80 then
        ShakeGameplayCam("DRUNK_SHAKE", 1.0)
        SetPedIsDrunk(PlayerPedId(), true)
        PlayWalking("move_m@drunk@verydrunk")
    elseif PlayerData.metadata["alcohol"] > 40 or PlayerData.metadata["drug"] > 40 then
        ShakeGameplayCam("DRUNK_SHAKE", 0.5)
        SetPedIsDrunk(PlayerPedId(), true)
        PlayWalking("move_m@drunk@moderatedrunk")
    elseif PlayerData.metadata["alcohol"] > 0 or PlayerData.metadata["drug"] > 0 then
        ShakeGameplayCam("DRUNK_SHAKE", 0.0)
        SetPedIsDrunk(PlayerPedId(), false)
        PlayWalking("move_m@drunk@slightlydrunk")
    else
        ResetPedMovementClipset(PlayerPedId())
        ShakeGameplayCam("DRUNK_SHAKE", 0.0)
        SetPedIsDrunk(PlayerPedId(), false)
        TriggerEvent("personal:client:ApplyWalkStyle")
    end
end)

--- Eat
RegisterNetEvent("consumables:client:Eat", function(itemName, expired)
    QBCore.Functions.Progressbar("eat_something", "", 5000, false, true, {disableCombat = true},
                                 {animDict = "mp_player_inteat@burger", anim = "mp_player_int_eat_burger", flags = 49}, {}, {}, function()
        if expired then
            TriggerServerEvent("QBCore:Server:SetMetaData", "hunger", QBCore.Functions.GetPlayerData().metadata["hunger"] - ConsumablesExpiredEat)
            TriggerServerEvent("lsmc:maladie:server:SetCurrentDisease", "intoxication")
        else
            TriggerServerEvent("QBCore:Server:SetMetaData", "hunger", QBCore.Functions.GetPlayerData().metadata["hunger"] + ConsumablesEat[itemName])
        end
    end, function()
        if expired then
            TriggerServerEvent("QBCore:Server:SetMetaData", "hunger", QBCore.Functions.GetPlayerData().metadata["hunger"] - ConsumablesExpiredEat)
            TriggerServerEvent("lsmc:maladie:server:SetCurrentDisease", "intoxication")
        end
    end)
end)

--- Drink
RegisterNetEvent("consumables:client:Drink", function(itemName, expired)
    QBCore.Functions.Progressbar("drink_something", "", 5000, false, true, {disableCombat = true},
                                 {animDict = "amb@world_human_drinking@coffee@male@idle_a", anim = "idle_c", flags = 49},
                                 {
        model = "ba_prop_club_water_bottle",
        bone = 28422,
        coords = {x = 0.01, y = -0.01, z = -0.06},
    }, {}, function()
        if expired then
            TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", QBCore.Functions.GetPlayerData().metadata["thirst"] - ConsumablesExpiredDrink)
            TriggerServerEvent("lsmc:maladie:server:SetCurrentDisease", "intoxication")
        else
            TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", QBCore.Functions.GetPlayerData().metadata["thirst"] + ConsumablesDrink[itemName])
            TriggerServerEvent("QBCore:Server:SetMetaData", "alcohol", QBCore.Functions.GetPlayerData().metadata["alcohol"] - (ConsumablesDrink[itemName] * 0.5))
        end
    end, function()
        if expired then
            TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", QBCore.Functions.GetPlayerData().metadata["thirst"] - ConsumablesExpiredDrink)
            TriggerServerEvent("lsmc:maladie:server:SetCurrentDisease", "intoxication")
        end
    end)
end)

--- Alcohol
RegisterNetEvent("consumables:client:DrinkAlcohol", function(itemName, extra)
    QBCore.Functions.Progressbar("snort_coke", "", math.random(3000, 6000), false, true, {disableCombat = true},
                                 {animDict = "amb@world_human_drinking@coffee@male@idle_a", anim = "idle_c", flags = 49},
                                 {model = extra.model, bone = 28422, coords = {x = 0.01, y = -0.01, z = -0.06}}, {}, function()
        if extra.expired then
            TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", QBCore.Functions.GetPlayerData().metadata["thirst"] - ConsumablesExpiredDrink)
            TriggerServerEvent("QBCore:Server:SetMetaData", "alcohol",
                               QBCore.Functions.GetPlayerData().metadata["alcohol"] + (ConsumablesAlcohol[itemName] * 1.2))
            TriggerServerEvent("lsmc:maladie:server:SetCurrentDisease", "intoxication")
        else
            -- L'alcool c'est de l'eau
            TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", QBCore.Functions.GetPlayerData().metadata["thirst"] + ConsumablesDrink[itemName])
            TriggerServerEvent("QBCore:Server:SetMetaData", "alcohol", QBCore.Functions.GetPlayerData().metadata["alcohol"] + ConsumablesAlcohol[itemName])
        end
    end, function()
        if extra.expired then
            TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", QBCore.Functions.GetPlayerData().metadata["thirst"] - ConsumablesExpiredDrink)
            TriggerServerEvent("lsmc:maladie:server:SetCurrentDisease", "intoxication")
        end
    end)
end)

--- Drugs
RegisterNetEvent("consumables:client:UseJoint", function()
    local animDict, anim, task
    if IsPedInAnyVehicle(PlayerPedId(), false) then
        animDict, anim = "amb@world_human_aa_smoke@male@idle_a", "idle_b"
    else
        task = "WORLD_HUMAN_DRUG_DEALER"
    end

    QBCore.Functions.Progressbar("smoke_joint", "", 1500, false, true, {disableCombat = true}, {
        animDict = animDict,
        anim = anim,
        task = task,
        flags = 49,
    }, {}, {}, function() -- Done
        TriggerServerEvent("QBCore:Server:SetMetaData", "drug", QBCore.Functions.GetPlayerData().metadata["drug"] + ConsumablesDrug["joint"])
    end)
end)

RegisterNetEvent("consumables:client:DrugsBag", function(itemName)
    QBCore.Functions.Progressbar("snort_coke", "", math.random(7000, 10000), false, true,
                                 {
        disableMovement = false,
        disableCarMovement = false,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "switch@trevor@trev_smoking_meth", anim = "trev_smoking_meth_loop", flags = 49}, {}, {}, function() -- Done
        TriggerServerEvent("QBCore:Server:SetMetaData", "drug", QBCore.Functions.GetPlayerData().metadata["drug"] + ConsumablesDrug[itemName])
    end)
end)

RegisterNetEvent("consumables:client:UseCardBoard", function()
    TriggerServerEvent("job:server:placeProps", "cardbord", "prop_cardbordbox_03a", 90)
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(PlayerData)
    local ped = PlayerPedId()
    local parachuteWeapon = GetHashKey("GADGET_PARACHUTE")

    for _, item in pairs(PlayerData.items or {}) do
        if item.name == "parachute" then
            if not HasPedGotWeapon(ped, parachuteWeapon, false) then
                GiveWeaponToPed(ped, parachuteWeapon, 1, false)
            end
            return
        end
    end

    if HasPedGotWeapon(ped, parachuteWeapon, false) then
        RemoveWeaponFromPed(ped, parachuteWeapon)
    end
end)

Citizen.CreateThread(function()
    local hasConsumedParachute = false
    while true do
        if not hasConsumedParachute and GetPedParachuteState(PlayerPedId()) == 1 then
            TriggerServerEvent("inventory:server:RemoveItem", PlayerData.source, "parachute", 1)
            hasConsumedParachute = true
        elseif hasConsumedParachute and (GetPedParachuteState(PlayerPedId()) == 3 or GetPedParachuteState(PlayerPedId()) == 0) then
            hasConsumedParachute = false
        end
        Citizen.Wait(100)
    end
end)

RegisterNetEvent("scuba:client:Toggle", function(scuba)
    PlayerData = QBCore.Functions.GetPlayerData()

    local skin = {
        [GetHashKey("mp_m_freemode_01")] = {
            Components = {
                [4] = {Drawable = 94, Texture = 0, Palette = 0},
                [6] = {Drawable = 67, Texture = 0, Palette = 0},
                [8] = {Drawable = 151, Texture = 0, Palette = 0},
                [11] = {Drawable = 243, Texture = 0, Palette = 0},
            },
            Props = {},
        },
        [GetHashKey("mp_f_freemode_01")] = {
            Components = {
                [4] = {Drawable = 97, Texture = 0, Palette = 0},
                [6] = {Drawable = 70, Texture = 0, Palette = 0},
                [8] = {Drawable = 187, Texture = 0, Palette = 0},
                [11] = {Drawable = 251, Texture = 0, Palette = 0},
            },
            Props = {},
        },
    }

    if scuba then
        QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
            disableMovement = true,
            disableCombat = true,
        }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
            SetEnableScuba(PlayerPedId(), true)
            SetPedMaxTimeUnderwater(PlayerPedId(), 1500.00)
            TriggerServerEvent("soz-character:server:SetPlayerJobClothes", skin[PlayerData.skin.Model.Hash])
        end)
    else
        QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
            disableMovement = true,
            disableCombat = true,
        }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
            SetEnableScuba(PlayerPedId(), false)
            SetPedMaxTimeUnderwater(PlayerPedId(), 15.00)
            TriggerServerEvent("soz-character:server:SetPlayerJobClothes", nil)
        end)
    end
end)
