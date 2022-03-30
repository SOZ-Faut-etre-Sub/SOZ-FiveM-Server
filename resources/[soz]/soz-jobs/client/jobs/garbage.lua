local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_garbage", "soz", "garbage:menu")
local haveGarbageBag, garbageBagProp = false, nil

CreateThread(function()
    exports["qb-target"]:AddBoxZone("garbage:cloakroom", vector3(-596.23, -1616.31, 33.01), 0.8, 10.8,
                                    {name = "garbage:cloakroom", heading = 355, minZ = 32.01, maxZ = 35.01}, {
        options = {
            {
                targeticon = "fas fa-box",
                icon = "fas fa-tshirt",
                event = "jobs:client:garbage:OpenCloakroomMenu",
                label = "Se changer",
                job = "garbage",
            },
        },
        distance = 2.5,
    })

    exports["qb-target"]:AddBoxZone("garbage:process", vector3(-583.05, -1610.89, 27.01), 5.8, 26.6,
                                    {name = "garbage:process", heading = 355, minZ = 26.01, maxZ = 30.01}, {
        options = {
            {
                label = "Recycler le contenu du sac",
                event = "jobs:client:garbage:processBags",
                targeticon = "fas fa-recycle",
                icon = "fas fa-recycle",
                job = "garbage",
            },
        },
        distance = 2.5,
    })
end)

--- Events
RegisterNetEvent("QBCore:Player:SetPlayerData", function(playerData)
    for _, item in pairs(playerData.items or {}) do
        if item.name == "garbagebag" then
            local player = PlayerPedId()
            if garbageBagProp == nil then
                garbageBagProp = CreateObject(GetHashKey("prop_cs_rub_binbag_01"), GetEntityCoords(player), true)
                AttachEntityToEntity(garbageBagProp, player, GetPedBoneIndex(player, 57005), 0.12, 0.0, -0.05, 220.0, 120.0, 0.0, true, true, false, true, 1,
                                     true)
            end

            CreateThread(function()
                local ped = PlayerPedId()
                haveGarbageBag = true

                while haveGarbageBag do
                    if not IsEntityPlayingAnim(ped, "missfbi4prepp1", "_bag_walk_garbage_man", 3) then
                        ClearPedTasksImmediately(ped)
                        QBCore.Functions.RequestAnimDict("missfbi4prepp1")
                        TaskPlayAnim(ped, "missfbi4prepp1", "_bag_walk_garbage_man", 6.0, -6.0, -1, 49, 0, 0, 0, 0)
                    end
                    Wait(200)
                end

                ClearPedTasksImmediately(ped)
            end)

            return
        end
    end

    if garbageBagProp ~= nil then
        DetachEntity(garbageBagProp, true, false)
        DeleteObject(garbageBagProp)
        garbageBagProp = nil
    end

    haveGarbageBag = false
end)

RegisterNetEvent("jobs:client:garbage:processBags", function()
    QBCore.Functions.Progressbar("Recyclage du sac", "Recyclage du sac en cours...", math.random(4000, 8000), false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {}, {}, {}, function() -- Done
        TriggerServerEvent("jobs:server:garbage:processBags")
    end)
end)

RegisterNetEvent("jobs:client:garbage:OpenSocietyMenu", function()
    societyMenu:ClearItems()

    societyMenu:AddCheckbox({
        label = "Afficher les points de collecte",
        change = function(_, checked)
            for binId, bin in pairs(GarbageConfig.BinLocation) do
                if not QBCore.Functions.GetBlip("garbage_bin_" .. binId) then
                    QBCore.Functions.CreateBlip("garbage_bin_" .. binId, {
                        name = "Point de collecte",
                        coords = bin,
                        sprite = 365,
                        color = 21,
                    })
                end

                QBCore.Functions.HideBlip("garbage_bin_" .. binId, not checked)
            end
        end,
    })

    societyMenu:Open()
end)

RegisterNetEvent("jobs:client:garbage:OpenCloakroomMenu", function()
    societyMenu:ClearItems()

    societyMenu:AddButton({
        label = "Tenue civile",
        value = nil,
        select = function()
            TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
        end,
    })

    societyMenu:AddButton({
        label = "Tenue de travail",
        value = nil,
        select = function()
            TriggerEvent("soz-character:Client:ApplyTemporaryClothSet", GarbageConfig.Cloakroom[PlayerData.skin.Model.Hash])
        end,
    })

    societyMenu:Open()
end)
