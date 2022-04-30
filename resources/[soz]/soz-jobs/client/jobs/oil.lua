local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_fueler", "soz", "fueler:menu")

local Tanker = {hasPipe = false, vehicle = nil, rope = nil, nozzle = nil}

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
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {label = "Facturer", icon = "c:jobs/facture.png", event = "jobs:client:fueler:InvoicePlayer", job = "oil"},
        },
        distance = 1.5,
    })

    exports["qb-target"]:AddBoxZone("mtp:duty", vector3(-246.62, 6090.77, 32.25), 0.15, 1.2, {
        name = "mtp:duty",
        heading = 45,
        minZ = 32.1,
        maxZ = 33.4,
    }, {options = SozJobCore.Functions.GetDutyActions("oil"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("mtp:fuel_craft", vector3(-251.12, 6081.49, 32.28), 0.95, 2.85,
                                    {name = "fuel_craft", heading = 45, minZ = 31.28, maxZ = 33.28}, {
        options = {
            {
                event = "jobs:client:fueler:StartCraftEssence",
                icon = "c:fuel/pistolet.png",
                label = "Carburant conditionné",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
                job = "oil",
            },
            {
                event = "jobs:client:fueler:StartCraftEssenceJerryCan",
                icon = "c:fuel/pistolet.png",
                label = "Bidon d’essence",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
                job = "oil",
            },
        },
        distance = 2.0,
    })
end)

--- Targets Locations
AddEventHandler("locations:zone:enter", function(zone, _)
    if zone == "fueler_petrol_farm" or zone == "fueler_petrol_refinery" then
        exports["qb-target"]:AddTargetModel({"tanker"}, {
            options = {
                {
                    event = "jobs:client:fueler:PrepareTankerRefill",
                    icon = "c:fuel/pistolet.png",
                    label = "Connecter le Tanker",
                    canInteract = function()
                        return not LocalPlayer.state.hasTankerPipe
                    end,
                    job = "oil",
                },
                {
                    event = "jobs:client:fueler:CancelTankerRefill",
                    icon = "c:fuel/pistolet.png",
                    label = "Déconnecter le Tanker",
                    canInteract = function()
                        return LocalPlayer.state.hasTankerPipe
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
                    canInteract = function()
                        return LocalPlayer.state.hasTankerPipe
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
                canInteract = function()
                    return LocalPlayer.state.hasTankerPipe
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
end)

AddEventHandler("locations:zone:exit", function(zone, _)
    if zone == "fueler_petrol_farm" or zone == "fueler_petrol_refinery" then
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
end)

--- Events
RegisterNetEvent("jobs:client:fueler:InvoicePlayer", function(data)
    local player = NetworkGetPlayerIndexFromPed(data.entity)

    local title = exports["soz-hud"]:Input("Titre", 200)
    if title == nil or title == "" then
        exports["soz-hud"]:DrawNotification("Vous devez spécifier un title", "error")
        return
    end

    local amount = exports["soz-hud"]:Input("Montant", 10)
    if amount == nil or tonumber(amount) == nil or tonumber(amount) <= 0 then
        exports["soz-hud"]:DrawNotification("Vous devez spécifier un montant", "error")
        return
    end

    TriggerServerEvent("banking:server:sendInvoice", GetPlayerServerId(player), title, amount)
end)

RegisterNetEvent("jobs:client:fueler:PrepareTankerRefill", function(data)
    local playerPed = PlayerPedId()
    local vehicle = data.entity
    local pCoords = GetEntityCoords(playerPed)

    LocalPlayer.state.hasTankerPipe = true
    Tanker.vehicle = VehToNet(vehicle)
    Tanker.hasPipe = true

    exports["soz-hud"]:DrawNotification("Vous cherchez à ~r~connecter~s~ le Tanker.", "info")

    TaskTurnPedToFaceEntity(playerPed, vehicle, 500)
    Wait(500)

    --- Create nozzle prop
    if Tanker.nozzle == nil then
        Tanker.nozzle = CreateObject(GetHashKey("hei_prop_hei_hose_nozzle"), pCoords.x, pCoords.y, pCoords.z + 1.2, true, true, true);
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
        DeleteObject(Tanker.nozzle)

        Tanker.nozzle = nil
    end

    QBCore.Functions.RequestAnimDict("missfbi4prepp1")
    TaskPlayAnim(playerPed, "missfbi4prepp1", "_bag_pickup_garbage_man", 6.0, -6.0, 2500, 49, 0, 1, 1, 1)
end)

RegisterNetEvent("jobs:client:fueler:StartTankerRefill", function(data)
    local playerPed = PlayerPedId()
    local canFillTanker = QBCore.Functions.TriggerRpc("jobs:server:fueler:canRefill", Tanker.vehicle)

    TaskTurnPedToFaceEntity(playerPed, data.entity, 500)
    Wait(500)

    exports["soz-hud"]:DrawNotification("Vous avez ~g~relié~s~ le Tanker au ~g~Puit de pétrole~s~.", "info")

    while canFillTanker do
        Wait(500)
        QBCore.Functions.Progressbar("fill", "Vous remplissez...", 30000, false, true, {
            disableMovement = true,
            disableCombat = true,
        }, {animDict = "timetable@gardener@filling_can", anim = "gar_ig_5_filling_can", flags = 1}, {}, {}, function() -- Done
            TriggerServerEvent("jobs:server:fueler:refillTanker", Tanker.vehicle)

            canFillTanker = QBCore.Functions.TriggerRpc("jobs:server:fueler:canRefill", Tanker.vehicle)
        end, function()
            canFillTanker = false
        end)

        Wait(30000)
    end

    TriggerEvent("jobs:client:fueler:CancelTankerRefill")
    exports["soz-hud"]:DrawNotification("La récolte est ~g~terminée~s~ ! Le tanker a été ~r~déconnecté~s~.", "info")
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

    while canCraft do
        Wait(500)
        QBCore.Functions.Progressbar("fill", "Vous transformez...", 2 * 60 * 1000, false, true, {
            disableMovement = true,
            disableCombat = true,
        }, {animDict = "amb@prop_human_bum_bin@base", anim = "base", flags = 1}, {}, {}, function() -- Done
            TriggerServerEvent("jobs:server:fueler:craftEssence")

            canCraft = playerHasItem("petroleum_refined")
        end, function()
            canCraft = false
        end)

        Wait(2 * 60 * 1000)
    end
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

    while canCraft do
        Wait(500)
        QBCore.Functions.Progressbar("fill", "Vous transformez...", 60 * 1000, false, true, {
            disableMovement = true,
            disableCombat = true,
        }, {animDict = "amb@prop_human_bum_bin@base", anim = "base", flags = 1}, {}, {}, function() -- Done
            TriggerServerEvent("jobs:server:fueler:craftEssenceJerryCan")

            canCraft = playerHasItem("essence", 3)
        end, function()
            canCraft = false
        end)

        Wait(60 * 1000)
    end
end)

RegisterNetEvent("jobs:client:fueler:StartTankerRefining", function(data)
    local playerPed = PlayerPedId()
    local canRefiningTanker = QBCore.Functions.TriggerRpc("jobs:server:fueler:canRefining", Tanker.vehicle)

    TaskTurnPedToFaceEntity(playerPed, data.entity, 500)
    Wait(500)

    exports["soz-hud"]:DrawNotification("Vous avez ~g~relié~s~ le Tanker à ~g~la raffinerie~s~.", "info")

    while canRefiningTanker do
        Wait(500)
        QBCore.Functions.Progressbar("fill", "Vous raffinez...", 30000, false, true, {
            disableMovement = true,
            disableCombat = true,
        }, {animDict = "timetable@gardener@filling_can", anim = "gar_ig_5_filling_can", flags = 1}, {}, {}, function() -- Done
            TriggerServerEvent("jobs:server:fueler:refiningTanker", Tanker.vehicle)

            canRefiningTanker = QBCore.Functions.TriggerRpc("jobs:server:fueler:canRefining", Tanker.vehicle)
        end, function()
            canRefiningTanker = false
        end)

        Wait(30000)
    end

    TriggerEvent("jobs:client:fueler:CancelTankerRefill")
    exports["soz-hud"]:DrawNotification("Le raffinage est ~g~terminée~s~ ! Le tanker a été ~r~déconnecté~s~.", "info")
end)

RegisterNetEvent("jobs:client:fueler:OpenSocietyMenu", function()
    societyMenu:ClearItems()

    if PlayerData.job.onduty then

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
