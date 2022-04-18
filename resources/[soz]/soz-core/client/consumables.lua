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
    if PlayerData.metadata["drug"] > 0 then
        AnimpostfxPlay("DrugsMichaelAliensFightIn", 5.0, false)
        AnimpostfxPlay("DrugsMichaelAliensFight", 0, true)
    elseif PlayerData.metadata["drug"] <= 0 and AnimpostfxIsRunning("DrugsMichaelAliensFight") then
        AnimpostfxPlay("DrugsMichaelAliensFightOut", 5.0, false)
        AnimpostfxStop("DrugsMichaelAliensFight")
    end

    if PlayerData.metadata["alcohol"] > 0 then
        AnimpostfxPlay("DrugsTrevorClownsFightIn", 5.0, false)
        AnimpostfxPlay("DrugsTrevorClownsFight", 0, true)
    elseif PlayerData.metadata["drug"] <= 0 and AnimpostfxIsRunning("DrugsTrevorClownsFight") then
        AnimpostfxPlay("DrugsTrevorClownsFightOut", 5.0, false)
        AnimpostfxStop("DrugsTrevorClownsFight")
    end

    if PlayerData.metadata["alcohol"] > 80 or PlayerData.metadata["drug"] > 80 then
        PlayWalking("move_m@drunk@verydrunk")
    elseif PlayerData.metadata["alcohol"] > 40 or PlayerData.metadata["drug"] > 40 then
        PlayWalking("move_m@drunk@moderatedrunk")
    elseif PlayerData.metadata["alcohol"] > 0 or PlayerData.metadata["drug"] > 0 then
        PlayWalking("move_m@drunk@slightlydrunk")
    else
        TriggerEvent("personal:client:ApplyWalkStyle")
    end
end)

--- Eat
RegisterNetEvent("consumables:client:Eat", function(itemName)
    QBCore.Functions.Progressbar("eat_something", "", 5000, false, true, {disableCombat = true},
                                 {animDict = "mp_player_inteat@burger", anim = "mp_player_int_eat_burger", flags = 49}, {}, {}, function()
        TriggerServerEvent("QBCore:Server:SetMetaData", "hunger", QBCore.Functions.GetPlayerData().metadata["hunger"] + ConsumablesEat[itemName])
    end)
end)

--- Drink
RegisterNetEvent("consumables:client:Drink", function(itemName)
    QBCore.Functions.Progressbar("drink_something", "", 5000, false, true, {disableCombat = true},
                                 {animDict = "amb@world_human_drinking@coffee@male@idle_a", anim = "idle_c", flags = 49},
                                 {
        model = "ba_prop_club_water_bottle",
        bone = 28422,
        coords = {x = 0.01, y = -0.01, z = -0.06},
    }, {}, function()
        TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", QBCore.Functions.GetPlayerData().metadata["thirst"] + ConsumablesDrink[itemName])
    end)
end)

--- Alcohol
RegisterNetEvent("consumables:client:DrinkAlcohol", function(itemName, model)
    QBCore.Functions.Progressbar("snort_coke", "", math.random(3000, 6000), false, true, {disableCombat = true},
                                 {animDict = "amb@world_human_drinking@coffee@male@idle_a", anim = "idle_c", flags = 49},
                                 {model = model, bone = 28422, coords = {x = 0.01, y = -0.01, z = -0.06}}, {}, function()
        -- L'alcool c'est de l'eau
        TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", QBCore.Functions.GetPlayerData().metadata["thirst"] + ConsumablesDrink[itemName])
        TriggerServerEvent("QBCore:Server:SetMetaData", "alcohol", QBCore.Functions.GetPlayerData().metadata["alcohol"] + ConsumablesAlcohol[itemName])
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
