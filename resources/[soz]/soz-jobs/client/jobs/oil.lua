local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_fueler", "soz", "fueler:menu")
local societyMenuState = {
    ["displayHarvestArea"] = false,
    ["displayRefiningArea"] = false,
    ["displayResaleArea"] = false,
}

local Tanker = {hasPipe = false, vehicle = nil, entity = nil, rope = nil, nozzle = nil, using = false}
local MaxFuelInStation, CurrentStation = 2000, nil

local currentField
local currentFieldHealth

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

local CreateTankerAction = function()
    exports["qb-target"]:AddGlobalVehicle({
        options = {
            {
                event = "jobs:client:fueler:PrepareTankerRefill",
                icon = "c:fuel/pistolet.png",
                label = "Connecter le Tanker",
                color = "oil",
                canInteract = function(entity)
                    if GetEntityModel(entity) ~= GetHashKey("tanker") and GetEntityModel(entity) ~= GetHashKey("tanker2") then
                        return false
                    end

                    return PlayerData.job.onduty and not LocalPlayer.state.hasTankerPipe
                end,
                job = "oil",
                blackoutGlobal = true,
                blackoutJob = "oil",
            },
            {
                event = "jobs:client:fueler:CancelTankerRefill",
                icon = "c:fuel/pistolet.png",
                label = "Déconnecter le Tanker",
                color = "oil",
                canInteract = function(entity)
                    if GetEntityModel(entity) ~= GetHashKey("tanker") and GetEntityModel(entity) ~= GetHashKey("tanker2") then
                        return false
                    end

                    return PlayerData.job.onduty and LocalPlayer.state.hasTankerPipe
                end,
                job = "oil",
            },
        },
        distance = 4.0,
    })
end

local function SpawnFieldZones()
    for field, data in pairs(FuelerConfig.Fields) do
        local points = data.zone

        local minZ, maxZ
        for i = 1, #points, 1 do
            if minZ == nil or points[i].z < minZ then
                minZ = points[i].z
            end
            if maxZ == nil or points[i].z > maxZ then
                maxZ = points[i].z
            end
        end

        local fieldZone = PolyZone:Create(points, {
            name = field,
            minZ = minZ - 2.0,
            maxZ = maxZ + 2.0,
            debugPoly = false,
        })
        fieldZone:onPlayerInOut(function(isInside)
            if isInside and PlayerData.job.id == SozJobCore.JobType.Oil and PlayerData.job.onduty then
                exports["qb-target"]:AddTargetModel({"p_oil_pjack_01_s", "p_oil_pjack_02_s", "p_oil_pjack_03_s"}, {
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
                            blackoutGlobal = true,
                            blackoutJob = "oil",
                        },
                    },
                    distance = 4.0,
                })

                currentField = field
                QBCore.Functions.TriggerCallback("soz-jobs:server:fueler:getFieldHealth", function(health)
                    currentFieldHealth = health
                    DisplayFieldHealth(true, currentField, currentFieldHealth)
                end, field)
            else
                currentField = nil
                currentFieldHealth = nil
                DisplayFieldHealth(false)
                exports["qb-target"]:RemoveTargetModel("p_oil_pjack_01_s", "Relier le Tanker")
                exports["qb-target"]:RemoveTargetModel("p_oil_pjack_02_s", "Relier le Tanker")
                exports["qb-target"]:RemoveTargetModel("p_oil_pjack_03_s", "Relier le Tanker")
                exports["qb-target"]:RemoveTargetModel("tanker", {"Connecter le Tanker", "Déconnecter le Tanker"})
            end
        end)
    end
end

--- Targets
CreateThread(function()
    CreateTankerAction()

    exports["qb-target"]:AddBoxZone("mtp:duty", vector3(-230.65, 6088.05, 31.39), 0.10, 3.10, {
        name = "mtp:duty",
        heading = 315,
        minZ = 30.39,
        maxZ = 33.39,
    }, {options = SozJobCore.Functions.GetDutyActions("oil"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("mtp:fuel_craft", vector3(-203.11, 6115.01, 31.35), 2.80, 3.20,
                                    {name = "fuel_craft", heading = 315, minZ = 30.35, maxZ = 33.35}, {
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
                blackoutGlobal = true,
                blackoutJob = "oil",
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
                blackoutGlobal = true,
                blackoutJob = "oil",
            },
        },
        distance = 2.0,
    })

    exports["qb-target"]:AddBoxZone("mtp:jerrycan_craft", vector3(-206.84, 6119.91, 31.35), 1.45, 3.20,
                                    {name = "jerrycan_craft", heading = 315, minZ = 30.35, maxZ = 33.35}, {
        options = {
            {
                event = "jobs:client:fueler:StartCraftEssenceJerryCan",
                icon = "c:fuel/pistolet.png",
                label = "Bidon d’essence",
                color = "oil",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
                job = "oil",
                blackoutGlobal = true,
                blackoutJob = "oil",
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
                blackoutGlobal = true,
                blackoutJob = "oil",
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
                blackoutGlobal = true,
                blackoutJob = "oil",
            },
        },
        distance = 2.0,
    })

    exports["qb-target"]:AddBoxZone("fueler:bossPrice", vector3(-244.89, 6068.39, 40.57), 0.55, 1.40,
                                    {name = "fueler:bossPrice", heading = 315, minZ = 39.57, maxZ = 42.57}, {
        options = {
            {
                label = "Configurateur station",
                icon = "c:fuel/remplir.png",
                event = "soz-core:client:oil:update-station-price",
                canInteract = function()
                    return PlayerData.job.onduty and SozJobCore.Functions.HasPermission("oil", SozJobCore.JobPermission.Fueler.ChangePrice)
                end,
                job = "oil",
            },
        },
        distance = 2.5,
    })

    SpawnFieldZones()
end)

--- Targets Locations
AddEventHandler("locations:zone:enter", function(zone, station, isAKeroseneStation)
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
                blackoutGlobal = true,
                blackoutJob = "oil",
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
                    blackoutGlobal = true,
                    blackoutJob = "oil",
                },
            },
            distance = 4.0,
        })
    end
    if zone == "fueler_petrol_station" then
        CurrentStation = station
    end
end)

AddEventHandler("locations:zone:exit", function(zone, _, isAKeroseneStation)
    if zone == "fueler_petrol_refinery" or (zone == "fueler_petrol_station" and not isAKeroseneStation) or zone == "fueler_petrol_resell" then
        exports["qb-target"]:RemoveTargetModel("tanker", {"Connecter le Tanker", "Déconnecter le Tanker"})
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
RegisterNetEvent("jobs:client:fueler:OpenCloakroomMenu", function(storageId)
    SozJobCore.Functions.OpenCloakroomMenu(societyMenu, FuelerConfig.Cloakroom, storageId)
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
    LocalPlayer.state.tankerEntity = vehicle
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
    LocalPlayer.state.tankerEntity = nil
    LocalPlayer.state.tankerUsing = false
    Tanker.hasPipe = false

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

    if LocalPlayer.state.tankerUsing then
        exports["soz-hud"]:DrawNotification("Vous utilisez deja le tanker.", "error")

        return
    end

    LocalPlayer.state.tankerUsing = true

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
            local refillResponse = QBCore.Functions.TriggerRpc("jobs:server:fueler:refillTanker", Tanker.vehicle, currentField)
            refillQuantity, currentFieldHealth = table.unpack(refillResponse)
            DisplayFieldHealth(true, currentField, currentFieldHealth)

            if currentFieldHealth == 0 then
                exports["soz-hud"]:DrawNotification("Le champ est épuisé...", "warning")
                canFillTanker = false
            elseif refillQuantity ~= 0 then
                canFillTanker = QBCore.Functions.TriggerRpc("jobs:server:fueler:canRefill", Tanker.vehicle)
            else
                canFillTanker = false
            end
        else
            canFillTanker = false
        end
    end

    LocalPlayer.state.tankerUsing = false
    TriggerEvent("jobs:client:fueler:CancelTankerRefill")
    exports["soz-hud"]:DrawNotification("La récolte est ~g~terminée~s~ ! Le tanker a été ~r~déconnecté~s~.", "info")
end)

RegisterNetEvent("jobs:client:fueler:StartTankerRefining", function(data)
    local playerPed = PlayerPedId()
    local model = GetEntityModel(Tanker.entity)
    local class = GetVehicleClass(Tanker.entity)
    local hasInventory = QBCore.Functions.TriggerRpc("jobs:server:fueler:ensureInventory", Tanker.vehicle, model, class)

    if not hasInventory then
        exports["soz-hud"]:DrawNotification("Le tanker n'a pas d'inventaire.", "error")

        return
    end

    if LocalPlayer.state.tankerUsing then
        exports["soz-hud"]:DrawNotification("Vous utilisez deja le tanker.", "error")

        return
    end

    LocalPlayer.state.tankerUsing = true

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

    LocalPlayer.state.tankerUsing = false
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

RegisterNetEvent("jobs:client:fueler:StartTankerResell", function(data)
    local playerPed = PlayerPedId()
    local model = GetEntityModel(Tanker.entity)
    local class = GetVehicleClass(Tanker.entity)
    local hasInventory = QBCore.Functions.TriggerRpc("jobs:server:fueler:ensureInventory", Tanker.vehicle, model, class)

    if not hasInventory then
        exports["soz-hud"]:DrawNotification("Le tanker n'a pas d'inventaire.", "error")

        return
    end

    if LocalPlayer.state.tankerUsing then
        exports["soz-hud"]:DrawNotification("Vous utilisez déjà le tanker.", "error")

        return
    end

    LocalPlayer.state.tankerUsing = true

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

    LocalPlayer.state.tankerUsing = false
    TriggerEvent("jobs:client:fueler:CancelTankerRefill")
    exports["soz-hud"]:DrawNotification("Le remplissage est ~g~terminée~s~ ! Le tanker a été ~r~déconnecté~s~.", "info")
end)

RegisterNetEvent("jobs:client:fueler:OpenSocietyMenu", function()
    if societyMenu.IsOpen then
        societyMenu:Close()
        return
    end
    societyMenu:ClearItems()

    if PlayerData.job.onduty then
        societyMenu:AddCheckbox({
            label = "Afficher la zone de récolte sur le GPS",
            value = societyMenuState.displayHarvestArea,
            change = function(_, value)
                societyMenuState.displayHarvestArea = value
                for _, coord in pairs({vector3(585.93, 2901.68, 39.72), vector3(1435.49, -2284.8, 71.37)}) do
                    if not QBCore.Functions.GetBlip("mtp_farm_" .. coord) then
                        QBCore.Functions.CreateBlip("mtp_farm_" .. coord, {
                            name = "Point de récolte",
                            coords = coord,
                            sprite = 436,
                            scale = 1.0,
                        })
                    end

                    QBCore.Functions.HideBlip("mtp_farm_" .. coord, not value)
                end
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

                QBCore.Functions.HideBlip("mtp_refinery", not value)
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
        coords = vector3(-251.75, 6099.03, 31.39),
        sprite = 436,
        scale = 1.0,
    })
end)
