local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_fueler", "soz", "fueler:menu")
local societyMenuState = {
    ['displayHarvestArea'] = false,
    ['displayRefiningArea'] = false,
    ['displayResaleArea'] = false
}

local Tanker = {hasPipe = false, vehicle = nil, entity = nil, rope = nil, nozzle = nil, using = false}
local MaxFuelInStation, CurrentStation = 2000, nil

--- functions
local function playerHasItem(item, amount)
    for _, slot in pairs(PlayerData.items) do
        if slot.name == item then
            if amount then
                return amount <= slot.amount
            else
                return true
            end
        end
    end

    return false
end

--- Targets
CreateThread(function()
    exports["qb-target"]:AddBoxZone("mtp:duty", vector3(-246.62, 6090.77, 32.25), 0.15, 1.2, {
        name = "mtp:duty",
        heading = 45,
        minZ = 32.1,
        maxZ = 33.4,
    }, {options = SozJobCore.Functions.GetDutyActions("oil"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("fueler:cloakroom", vector3(-231.78, 6078.43, 32.26), 3.55, 4.0,
                                    {name = "fueler:cloakroom", heading = 316, minZ = 31.26, maxZ = 33.5}, {
        options = {
            {
                label = "S'habiller",
                icon = "c:jobs/habiller.png",
                event = "jobs:client:fueler:OpenCloakroomMenu",
                job = "oil",
            },
        },
        distance = 2.5,
    })

    exports["qb-target"]:AddBoxZone("mtp:fuel_craft", vector3(-251.12, 6081.49, 32.28), 0.95, 2.85,
                                    {name = "fuel_craft", heading = 45, minZ = 31.28, maxZ = 33.28}, {
        options = {
            {
                event = "jobs:client:fueler:StartCraftEssence",
                icon = "c:fuel/pistolet.png",
                label = "Carburant conditionné",
                color = "oil",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
                job = "oil",
            },
            {
                event = "jobs:client:fueler:StartCraftEssenceJerryCan",
                icon = "c:fuel/pistolet.png",
                label = "Bidon d’essence",
                color = "oil",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
                job = "oil",
            },
            {
                event = "jobs:client:fueler:StartCraftKerosene",
                icon = "c:fuel/pistolet.png",
                label = "Kérosène conditionné",
                color = "oil",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
                job = "oil",
            },
            {
                event = "jobs:client:fueler:StartCraftKeroseneJerryCan",
                icon = "c:fuel/pistolet.png",
                label = "Bidon de kérosène",
                color = "oil",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
                job = "oil",
            },
        },
        distance = 2.0,
    })

    exports["qb-target"]:AddBoxZone("mtp:fuel_resell", vector3(263.58, -2972.16, 5.31), 10.4, 10.4,
                                    {name = "fuel_resell", heading = 45, minZ = 31.28, maxZ = 33.28}, {
        options = {
            {
                event = "jobs:client:fueler:StartTankerResell",
                icon = "c:fuel/remplir.png",
                label = "Relier le Tanker",
                color = "oil",
                canInteract = function()
                    return PlayerData.job.onduty and LocalPlayer.state.hasTankerPipe
                end,
                job = "oil",
            },
        },
        distance = 2.0,
    })
end)

--- Targets Locations
AddEventHandler("locations:zone:enter", function(zone, station)
    if zone == "fueler_petrol_farm" or zone == "fueler_petrol_refinery" or zone == "fueler_petrol_station" or zone == "fueler_petrol_resell" then
        exports["qb-target"]:AddTargetModel({"tanker"}, {
            options = {
                {
                    event = "jobs:client:fueler:PrepareTankerRefill",
                    icon = "c:fuel/pistolet.png",
                    label = "Connecter le Tanker",
                    color = "oil",
                    canInteract = function()
                        return PlayerData.job.onduty and not LocalPlayer.state.hasTankerPipe
                    end,
                    job = "oil",
                },
                {
                    event = "jobs:client:fueler:CancelTankerRefill",
                    icon = "c:fuel/pistolet.png",
                    label = "Déconnecter le Tanker",
                    color = "oil",
                    canInteract = function()
                        return PlayerData.job.onduty and LocalPlayer.state.hasTankerPipe
                    end,
                    job = "oil",
                },
            },
            distance = 4.0,
        })
    end
    if zone == "fueler_petrol_farm" then
        exports["qb-target"]:AddTargetModel({"p_oil_pjack_03_s"}, {
            options = {
                {
                    event = "jobs:client:fueler:StartTankerRefill",
                    icon = "c:fuel/remplir.png",
                    label = "Relier le Tanker",
                    color = "oil",
                    canInteract = function()
                        return PlayerData.job.onduty and LocalPlayer.state.hasTankerPipe
                    end,
                    job = "oil",
                },
            },
            distance = 4.0,
        })
    end
    if zone == "fueler_petrol_refinery" then
        local refineryActions = {
            {
                event = "jobs:client:fueler:StartTankerRefining",
                icon = "c:fuel/remplir.png",
                label = "Relier le Tanker",
                color = "oil",
                canInteract = function()
                    return PlayerData.job.onduty and LocalPlayer.state.hasTankerPipe
                end,
                job = "oil",
            },
        }

        exports["qb-target"]:AddBoxZone("refinery1", vector3(2772.16, 1496.61, 24.49), 5.25, 12.2, {
            heading = 75,
            minZ = 23.49,
            maxZ = 28.49,
        }, {options = refineryActions, distance = 4.0})
        exports["qb-target"]:AddBoxZone("refinery2", vector3(2780.79, 1528.84, 24.52), 5.25, 12.2, {
            heading = 75,
            minZ = 23.49,
            maxZ = 28.49,
        }, {options = refineryActions, distance = 4.0})
        exports["qb-target"]:AddBoxZone("refinery3", vector3(2790.07, 1561.52, 24.58), 5.25, 12.2, {
            heading = 75,
            minZ = 23.49,
            maxZ = 28.49,
        }, {options = refineryActions, distance = 4.0})
    end
    if zone == "fueler_petrol_resell" then
        exports["qb-target"]:AddBoxZone("mtp:resell", vector3(263.58, -2972.16, 5.31), 10.4, 10.4, {
            heading = 75,
            minZ = 4.31,
            maxZ = 8.31,
        }, {
            options = {
                {
                    event = "jobs:client:fueler:StartTankerResell",
                    icon = "c:fuel/remplir.png",
                    label = "Relier le Tanker",
                    color = "oil",
                    canInteract = function()
                        return PlayerData.job.onduty and LocalPlayer.state.hasTankerPipe
                    end,
                    job = "oil",
                },
            },
            distance = 4.0,
        })
    end
    if zone == "fueler_petrol_station" then
        CurrentStation = station
    end
end)

AddEventHandler("locations:zone:exit", function(zone, _)
    if zone == "fueler_petrol_farm" or zone == "fueler_petrol_refinery" or zone == "fueler_petrol_station" or zone == "fueler_petrol_resell" then
        exports["qb-target"]:RemoveTargetModel("tanker", {"Connecter le Tanker", "Déconnecter le Tanker"})
    end
    if zone == "fueler_petrol_farm" then
        exports["qb-target"]:RemoveTargetModel("p_oil_pjack_03_s", "Relier le Tanker")
    end
    if zone == "fueler_petrol_refinery" then
        exports["qb-target"]:RemoveZone("refinery1")
        exports["qb-target"]:RemoveZone("refinery2")
        exports["qb-target"]:RemoveZone("refinery3")
    end
    if zone == "fueler_petrol_resell" then
        exports["qb-target"]:RemoveZone("mtp:resell")
    end
    if zone == "fueler_petrol_station" then
        CurrentStation = nil
    end
end)

--- Events
RegisterNetEvent("jobs:client:fueler:OpenCloakroomMenu", function()
    SozJobCore.Functions.OpenCloakroomMenu(societyMenu, FuelerConfig.Cloakroom)
end)

RegisterNetEvent("jobs:client:fueler:PrepareTankerRefill", function(data)
    local playerPed = PlayerPedId()
    local vehicle = data.entity
    local pCoords = GetEntityCoords(playerPed)
    local vehicleNetId = VehToNet(vehicle)

    local lockTanker = QBCore.Functions.TriggerRpc("jobs:server:fueler:lockTanker", vehicleNetId)

    if not lockTanker then
        exports["soz-hud"]:DrawNotification("Le tanker ne possède que 2 connexions.", "error")

        return
    end

    LocalPlayer.state.hasTankerPipe = true
    Tanker.entity = vehicle
    Tanker.vehicle = vehicleNetId
    Tanker.hasPipe = true

    exports["soz-hud"]:DrawNotification("Vous cherchez à ~r~connecter~s~ le Tanker.", "info")

    TaskTurnPedToFaceEntity(playerPed, vehicle, 500)
    Wait(500)

    --- Create nozzle prop
    if Tanker.nozzle == nil then
        Tanker.nozzle = CreateObject(GetHashKey("hei_prop_hei_hose_nozzle"), pCoords.x, pCoords.y, pCoords.z + 1.2, true, true, true);
        SetNetworkIdCanMigrate(ObjToNet(Tanker.nozzle), false)
        AttachEntityToEntity(Tanker.nozzle, playerPed, GetPedBoneIndex(playerPed, 60309), 0.10, 0.0, 0.012, 210.0, 90.0, 20.0, 1, 0, 0, 0, 2, 1)
    end

    --- Create pipe
    RopeLoadTextures()

    if Tanker.rope == nil then
        Tanker.rope = AddRope(pCoords.x, pCoords.y, pCoords.z, 0.0, 0.0, 0.0, 25.0, 3, 20.0, 1.0, 0, 0, 1, 0, 1.0, 0, 0)
        local ropeCoords = GetOffsetFromEntityInWorldCoords(vehicle, 0.0, -5.9, -1.0)
        AttachRopeToEntity(Tanker.rope, vehicle, ropeCoords, 1)
    end

    QBCore.Functions.RequestAnimDict("missfbi4prepp1")
    TaskPlayAnim(playerPed, "missfbi4prepp1", "_bag_pickup_garbage_man", 6.0, -6.0, 2500, 49, 0, 1, 1, 1)

    CreateThread(function()
        if Tanker.rope == nil then
            return
        end

        while Tanker.hasPipe do
            local ropeCoords = GetOffsetFromEntityInWorldCoords(vehicle, 0.0, -5.9, -1.0)
            local hCoord = GetWorldPositionOfEntityBone(playerPed, GetEntityBoneIndexByName(playerPed, "BONETAG_L_FINGER2"))
            AttachEntitiesToRope(Tanker.rope, vehicle, playerPed, ropeCoords.x, ropeCoords.y, ropeCoords.z, hCoord.x, hCoord.y, hCoord.z, 100, 1, 1, 0,
                                 "BONETAG_L_FINGER2")

            Wait(10)
        end
    end)
end)

RegisterNetEvent("jobs:client:fueler:CancelTankerRefill", function(data)
    LocalPlayer.state.hasTankerPipe = false
    Tanker.hasPipe = false
    Tanker.using = false

    local playerPed = PlayerPedId()

    if data then
        TaskTurnPedToFaceEntity(playerPed, data.entity, 500)
        Wait(500)
    end

    if Tanker.rope ~= nil then
        DeleteRope(Tanker.rope)
        RopeUnloadTextures()

        Tanker.rope = nil
    end

    if Tanker.nozzle ~= nil then
        DetachEntity(Tanker.nozzle, true, false)
        DeleteEntity(Tanker.nozzle)

        Tanker.nozzle = nil
    end

    QBCore.Functions.TriggerRpc("jobs:server:fueler:unlockTanker", Tanker.vehicle)
    QBCore.Functions.RequestAnimDict("missfbi4prepp1")
    TaskPlayAnim(playerPed, "missfbi4prepp1", "_bag_pickup_garbage_man", 6.0, -6.0, 2500, 49, 0, 1, 1, 1)
end)

RegisterNetEvent("jobs:client:fueler:StartTankerRefill", function(data)
    local playerPed = PlayerPedId()
    local model = GetEntityModel(Tanker.entity)
    local class = GetVehicleClass(Tanker.entity)
    local hasInventory = QBCore.Functions.TriggerRpc("jobs:server:fueler:ensureInventory", Tanker.vehicle, model, class)

    if not hasInventory then
        exports["soz-hud"]:DrawNotification("Le tanker n'a pas d'inventaire.", "error")

        return
    end
    local canFillTanker = QBCore.Functions.TriggerRpc("jobs:server:fueler:canRefill", Tanker.vehicle)

    if Tanker.using then
        exports["soz-hud"]:DrawNotification("Vous utilisez deja le tanker.", "error")

        return
    end

    Tanker.using = true

    TaskTurnPedToFaceEntity(playerPed, data.entity, 500)
    Wait(500)

    exports["soz-hud"]:DrawNotification("Vous avez ~g~relié~s~ le Tanker au ~g~Puit de pétrole~s~.", "info")

    while canFillTanker do
        Wait(500)

        local success, _ = exports["soz-utils"]:Progressbar("fill", "Vous remplissez...", 24000, false, true, {
            disableMovement = true,
            disableCombat = true,
        }, {animDict = "timetable@gardener@filling_can", anim = "gar_ig_5_filling_can", flags = 1}, {}, {})

        if success then
            TriggerServerEvent("jobs:server:fueler:refillTanker", Tanker.vehicle)
            Wait(1000)
            canFillTanker = QBCore.Functions.TriggerRpc("jobs:server:fueler:canRefill", Tanker.vehicle)
        else
            canFillTanker = false
        end
    end

    Tanker.using = false
    TriggerEvent("jobs:client:fueler:CancelTankerRefill")
    exports["soz-hud"]:DrawNotification("La récolte est ~g~terminée~s~ ! Le tanker a été ~r~déconnecté~s~.", "info")
end)

RegisterNetEvent("jobs:client:fueler:StartTankerRefining", function(data)
    local playerPed = PlayerPedId()
    local model = GetEntityModel(Tanker.vehicle)
    local class = GetVehicleClass(Tanker.vehicle)
    local hasInventory = QBCore.Functions.TriggerRpc("jobs:server:fueler:ensureInventory", Tanker.vehicle, model, class)

    if not hasInventory then
        exports["soz-hud"]:DrawNotification("Le tanker n'a pas d'inventaire.", "error")

        return
    end

    if Tanker.using then
        exports["soz-hud"]:DrawNotification("Vous utilisez deja le tanker.", "error")

        return
    end

    Tanker.using = true

    local canRefiningTanker = QBCore.Functions.TriggerRpc("jobs:server:fueler:canRefining", Tanker.vehicle)

    TaskTurnPedToFaceEntity(playerPed, data.entity, 500)
    Wait(500)

    exports["soz-hud"]:DrawNotification("Vous avez ~g~relié~s~ le Tanker à ~g~la raffinerie~s~.", "info")

    while canRefiningTanker do
        Wait(500)

        local success, _ = exports["soz-utils"]:Progressbar("fill", "Vous raffinez...", 24000, false, true, {
            disableMovement = true,
            disableCombat = true,
        }, {animDict = "timetable@gardener@filling_can", anim = "gar_ig_5_filling_can", flags = 1}, {}, {})

        if success then
            TriggerServerEvent("jobs:server:fueler:refiningTanker", Tanker.vehicle)
            Wait(1000)
            canRefiningTanker = QBCore.Functions.TriggerRpc("jobs:server:fueler:canRefining", Tanker.vehicle)
        else
            canRefiningTanker = false
        end
    end

    Tanker.using = false
    TriggerEvent("jobs:client:fueler:CancelTankerRefill")
    exports["soz-hud"]:DrawNotification("Le raffinage est ~g~terminée~s~ ! Le tanker a été ~r~déconnecté~s~.", "info")
end)

RegisterNetEvent("jobs:client:fueler:StartCraftEssence", function(data)
    local playerPed = PlayerPedId()
    local canCraft = playerHasItem("petroleum_refined")

    if not canCraft then
        return
    end

    TaskTurnPedToFaceEntity(playerPed, data.entity, 500)
    Wait(500)

    exports["soz-hud"]:DrawNotification("Vous ~g~démarrez~s~ la transformation.", "info")
    QBCore.Functions.Progressbar("fill", "Vous transformez...", 2 * 60 * 1000, false, true, {
        disableMovement = true,
        disableCombat = true,
    }, {animDict = "amb@prop_human_bum_bin@base", anim = "base", flags = 1}, {}, {}, function() -- Done
        TriggerServerEvent("jobs:server:fueler:craftEssence")
        Wait(1000)

        canCraft = playerHasItem("petroleum_refined")
    end)
end)

RegisterNetEvent("jobs:client:fueler:StartCraftEssenceJerryCan", function(data)
    local playerPed = PlayerPedId()
    local canCraft = playerHasItem("essence", 3)

    if not canCraft then
        return
    end

    TaskTurnPedToFaceEntity(playerPed, data.entity, 500)
    Wait(500)

    exports["soz-hud"]:DrawNotification("Vous ~g~démarrez~s~ la transformation.", "info")
    QBCore.Functions.Progressbar("fill", "Vous transformez...", 60 * 1000, false, true, {
        disableMovement = true,
        disableCombat = true,
    }, {animDict = "amb@prop_human_bum_bin@base", anim = "base", flags = 1}, {}, {}, function() -- Done
        TriggerServerEvent("jobs:server:fueler:craftEssenceJerryCan")
    end)
end)

RegisterNetEvent("jobs:client:fueler:StartCraftKerosene", function(data)
    local playerPed = PlayerPedId()
    local canCraft = playerHasItem("petroleum_refined", 4)
    if not canCraft then
        return
    end

    TaskTurnPedToFaceEntity(playerPed, data.entity, 500)
    Wait(500)

    exports["soz-hud"]:DrawNotification("Vous ~g~démarrez~s~ la transformation.", "info")
    QBCore.Functions.Progressbar("fill", "Vous transformez...", 2 * 60 * 1000, false, true, {
        disableMovement = true,
        disableCombat = true,
    }, {animDict = "amb@prop_human_bum_bin@base", anim = "base", flags = 1}, {}, {}, function() -- Done
        TriggerServerEvent("jobs:server:fueler:craftKerosene")
        Wait(1000)

        canCraft = playerHasItem("petroleum_refined", 4)
    end)
end)

RegisterNetEvent("jobs:client:fueler:StartCraftKeroseneJerryCan", function(data)
    local playerPed = PlayerPedId()
    local canCraft = playerHasItem("kerosene", 3)

    if not canCraft then
        return
    end

    TaskTurnPedToFaceEntity(playerPed, data.entity, 500)
    Wait(500)

    exports["soz-hud"]:DrawNotification("Vous ~g~démarrez~s~ la transformation.", "info")
    QBCore.Functions.Progressbar("fill", "Vous transformez...", 60 * 1000, false, true, {
        disableMovement = true,
        disableCombat = true,
    }, {animDict = "amb@prop_human_bum_bin@base", anim = "base", flags = 1}, {}, {}, function() -- Done
        TriggerServerEvent("jobs:server:fueler:craftKeroseneJerryCan")
    end)
end)

RegisterNetEvent("jobs:client:fueler:StartStationRefill", function(data)
    local playerPed = PlayerPedId()
    if CurrentStation == nil then
        return
    end

    TaskTurnPedToFaceEntity(playerPed, data.entity, 500)
    Wait(500)

    local station = QBCore.Functions.TriggerRpc("fuel:server:GetStation", CurrentStation)
    if station == nil then
        return
    end

    local refillRequest = exports["soz-hud"]:Input("Quantité a ajouter (en Litre) :", 4, MaxFuelInStation - station.stock)
    local model = GetEntityModel(Tanker.vehicle)
    local class = GetVehicleClass(Tanker.vehicle)
    local hasInventory = QBCore.Functions.TriggerRpc("jobs:server:fueler:ensureInventory", Tanker.vehicle, model, class)

    if not hasInventory then
        exports["soz-hud"]:DrawNotification("Le tanker n'a pas d'inventaire.", "error")

        return
    end

    if Tanker.using then
        exports["soz-hud"]:DrawNotification("Vous utilisez deja le tanker.", "error")

        return
    end

    Tanker.using = true

    if refillRequest and tonumber(refillRequest) >= 10 and tonumber(refillRequest) <= (MaxFuelInStation - station.stock) then
        local canStationRefill = QBCore.Functions.TriggerRpc("jobs:server:fueler:canStationRefill", Tanker.vehicle, tonumber(refillRequest))

        if canStationRefill then
            exports["soz-hud"]:DrawNotification("Vous avez ~g~relié~s~ le Tanker à ~g~la station service~s~.", "info")
            QBCore.Functions.Progressbar("fill", "Vous remplissez...", 20000, false, true, {
                disableMovement = true,
                disableCombat = true,
            }, {animDict = "timetable@gardener@filling_can", anim = "gar_ig_5_filling_can", flags = 1}, {}, {}, function() -- Done
                TriggerServerEvent("jobs:server:fueler:refillStation", Tanker.vehicle, CurrentStation, tonumber(refillRequest))
                TriggerEvent("jobs:client:fueler:CancelTankerRefill")
                exports["soz-hud"]:DrawNotification("La station service a été ~g~remplie~s~ ! Le tanker a été ~r~déconnecté~s~.", "info")
            end, function()
                TriggerEvent("jobs:client:fueler:CancelTankerRefill")
            end)
        else
            exports["soz-hud"]:DrawNotification("Le tanker n'a pas ~r~assez~s~ de stock.", "error")
        end
    else
        exports["soz-hud"]:DrawNotification("Valeur de remplissage ~r~incorrecte~s~.", "error")
    end

    Tanker.using = false
end)

RegisterNetEvent("jobs:client:fueler:StartKeroseneStationRefill", function(data)
    local playerPed = PlayerPedId()
    if CurrentStation == nil then
        return
    end

    TaskTurnPedToFaceEntity(playerPed, data.entity, 500)
    Wait(500)

    local station = QBCore.Functions.TriggerRpc("fuel:server:GetStation", CurrentStation)
    if station == nil then
        return
    end

    local refillRequest = exports["soz-hud"]:Input("Quantité a ajouter (en Litre) :", 4, MaxFuelInStation - station.stock)

    if refillRequest and tonumber(refillRequest) >= 10 and tonumber(refillRequest) <= (MaxFuelInStation - station.stock) then
        local canStationRefill = QBCore.Functions.TriggerRpc("jobs:server:fueler:canKeroseneStationRefill", tonumber(refillRequest))

        if canStationRefill then
            QBCore.Functions.Progressbar("fill", "Vous remplissez...", 20000, false, true, {
                disableMovement = true,
                disableCombat = true,
            }, {animDict = "timetable@gardener@filling_can", anim = "gar_ig_5_filling_can", flags = 1}, {}, {}, function() -- Done
                TriggerServerEvent("jobs:server:fueler:refillKeroseneStation", CurrentStation, tonumber(refillRequest))
                exports["soz-hud"]:DrawNotification("La station service a été ~g~remplie~s~ !", "info")
            end)
        else
            exports["soz-hud"]:DrawNotification("Vous n'avez pas ~r~assez~s~ de bidon.", "error")
        end
    else
        exports["soz-hud"]:DrawNotification("Valeur de remplissage ~r~incorrecte~s~.", "error")
    end
end)

RegisterNetEvent("jobs:client:fueler:StartTankerResell", function(data)
    local playerPed = PlayerPedId()
    local model = GetEntityModel(Tanker.vehicle)
    local class = GetVehicleClass(Tanker.vehicle)
    local hasInventory = QBCore.Functions.TriggerRpc("jobs:server:fueler:ensureInventory", Tanker.vehicle, model, class)

    if not hasInventory then
        exports["soz-hud"]:DrawNotification("Le tanker n'a pas d'inventaire.", "error")

        return
    end

    if Tanker.using then
        exports["soz-hud"]:DrawNotification("Vous utilisez déjà le tanker.", "error")

        return
    end

    Tanker.using = true

    local canResellTanker = QBCore.Functions.TriggerRpc("jobs:server:fueler:canResell", Tanker.vehicle)

    TaskTurnPedToFaceEntity(playerPed, data.entity, 500)
    Wait(500)

    exports["soz-hud"]:DrawNotification("Vous avez ~g~relié~s~ le Tanker à ~g~la cuve~s~.", "info")

    while canResellTanker do
        Wait(500)

        local success, _ = exports["soz-utils"]:Progressbar("resell", "Vous remplissez...", 5000, false, true, {
            disableMovement = true,
            disableCombat = true,
        }, {animDict = "timetable@gardener@filling_can", anim = "gar_ig_5_filling_can", flags = 1}, {}, {})

        if success then
            QBCore.Functions.TriggerRpc("jobs:server:fueler:resellTanker", Tanker.vehicle)
            canResellTanker = QBCore.Functions.TriggerRpc("jobs:server:fueler:canResell", Tanker.vehicle)
        else
            canResellTanker = false
        end
    end

    Tanker.using = false
    TriggerEvent("jobs:client:fueler:CancelTankerRefill")
    exports["soz-hud"]:DrawNotification("Le remplissage est ~g~terminée~s~ ! Le tanker a été ~r~déconnecté~s~.", "info")
end)

RegisterNetEvent("jobs:client:fueler:OpenSocietyMenu", function()
    societyMenu:ClearItems()

    if PlayerData.job.onduty then
        societyMenu:AddCheckbox({
            label = "Afficher la zone de récolte sur le GPS",
            value = societyMenuState.displayHarvestArea,
            change = function(_, value)
                societyMenuState.displayHarvestArea = value
                if not QBCore.Functions.GetBlip("mtp_farm") then
                    QBCore.Functions.CreateBlip("mtp_farm", {
                        name = "Point de récolte",
                        coords = vector3(585.93, 2901.68, 39.72),
                        sprite = 436,
                        scale = 1.0,
                    })
                end

                QBCore.Functions.HideBlip("mtp_resell", not value)
            end,
        })

        societyMenu:AddCheckbox({
            label = "Afficher la zone de raffinage sur le GPS",
            value = societyMenuState.displayRefiningArea,
            change = function(_, value)
                societyMenuState.displayRefiningArea = value
                if not QBCore.Functions.GetBlip("mtp_refinery") then
                    QBCore.Functions.CreateBlip("mtp_refinery",
                                                {
                        name = "Point de raffinage",
                        coords = vector3(2793.73, 1524.45, 24.52),
                        sprite = 436,
                        scale = 1.0,
                    })
                end

                QBCore.Functions.HideBlip("mtp_resell", not value)
            end,
        })

        societyMenu:AddCheckbox({
            label = "Afficher la zone de revente sur le GPS",
            value = societyMenuState.displayResaleArea,
            change = function(_, value)
                societyMenuState.displayResaleArea = value
                if not QBCore.Functions.GetBlip("mtp_resell") then
                    QBCore.Functions.CreateBlip("mtp_resell", {
                        name = "Point de vente",
                        coords = vector3(263.41, -2979.47, 4.93),
                        sprite = 436,
                        scale = 1.0,
                    })
                end

                QBCore.Functions.HideBlip("mtp_resell", not value)
            end,
        })
    else
        societyMenu:AddButton({label = "Tu n'es pas en service !", disabled = true})
    end

    if societyMenu.IsOpen then
        MenuV:CloseAll(function()
            societyMenu:Close()
        end)
    else
        MenuV:CloseAll(function()
            societyMenu:Open()
        end)
    end
end)

--- Threads
CreateThread(function()
    QBCore.Functions.CreateBlip("jobs:oil", {
        name = "Michel Transport Petrol",
        coords = vector3(-243.97, 6071.59, 32.32),
        sprite = 436,
        scale = 1.0,
    })
end)
