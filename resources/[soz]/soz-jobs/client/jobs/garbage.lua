local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_garbage", "soz", "garbage:menu")
local haveGarbageBag, garbageBagProp = false, nil
local binLocation = {}

CreateThread(function()
    exports["qb-target"]:AddBoxZone("garbage:duty", vector3(-615.5, -1622.18, 33.01), 0.6, 0.6,
                                    {name = "garbage:cloakroom", heading = 59, minZ = 32.70, maxZ = 33.30},
                                    {options = SozJobCore.Functions.GetDutyActions("garbage"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("garbage:cloakroom", vector3(-596.23, -1616.31, 33.01), 0.8, 10.8,
                                    {name = "garbage:cloakroom", heading = 355, minZ = 32.01, maxZ = 35.01}, {
        options = {
            {
                label = "S'habiller",
                icon = "c:jobs/habiller.png",
                event = "jobs:client:garbage:OpenCloakroomMenu",
                job = "garbage",
            },
        },
        distance = 2.5,
    })

    local garbageActions = {}
    for item, _ in pairs(GarbageConfig.RecycleItem) do
        garbageActions[#garbageActions + 1] = {
            label = ("Recycler \"%s\""):format(QBCore.Shared.Items[item].label),
            icon = "c:bluebird/recycler.png",
            event = "jobs:client:garbage:processBags",
            item = item,
            canInteract = function()
                return PlayerData.job.onduty
            end,
            job = "garbage",
        }
    end

    exports["qb-target"]:AddBoxZone("garbage:process", vector3(-601.26, -1602.99, 30.41), 2.2, 3.4,
                                    {name = "garbage:process", heading = 355, minZ = 29.41, maxZ = 32.41}, {
        options = garbageActions,
        distance = 2.5,
    })

    local props = QBCore.Functions.TriggerRpc("core:server:getProps")
    for _, prop in pairs(props) do
        if prop.model == 1010534896 then
            binLocation[prop.id] = prop
        end
    end
end)

--- Functions
local function isPlayingGarbageAnim(ped)
    return IsEntityPlayingAnim(ped, "missfbi4prepp1", "_bag_pickup_garbage_man", 3) or IsEntityPlayingAnim(ped, "missfbi4prepp1", "_bag_throw_garbage_man", 3)
end

local attachBag = function()
    if garbageBagProp == nil then
        local player = PlayerPedId()
        garbageBagProp = CreateObject(GetHashKey("prop_cs_rub_binbag_01"), GetEntityCoords(player), true)
        AttachEntityToEntity(garbageBagProp, player, GetPedBoneIndex(player, 57005), 0.12, 0.0, -0.05, 220.0, 120.0, 0.0, true, true, false, true, 1, true)
    end
end

local detachBag = function()
    if garbageBagProp ~= nil then
        DetachEntity(garbageBagProp, true, false)
        DeleteObject(garbageBagProp)
        garbageBagProp = nil
    end
end

--- Events
RegisterNetEvent("jobs:client:garbage:processBags", function(data)
    QBCore.Functions.Progressbar("Recyclage du sac", "Recyclage en cours...", math.random(4000, 8000), false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "missfbi4prepp1", anim = "_bag_throw_garbage_man", flags = 49}, {}, {}, function() -- Done
        TriggerServerEvent("jobs:server:garbage:processBags", data.item)
    end)
end)

RegisterNetEvent("jobs:client:garbage:OpenSocietyMenu", function()
    societyMenu:ClearItems()

    if PlayerData.job.onduty then
        societyMenu:AddCheckbox({
            label = "Afficher les points de collecte",
            change = function(_, checked)
                for binId, bin in pairs(binLocation) do
                    if not QBCore.Functions.GetBlip("garbage_bin_" .. binId) then
                        QBCore.Functions.CreateBlip("garbage_bin_" .. binId, {
                            name = "Point de collecte",
                            coords = vec3(bin.position.x, bin.position.y, bin.position.z),
                            sprite = 365,
                            color = 21,
                        })
                    end

                    QBCore.Functions.HideBlip("garbage_bin_" .. binId, not checked)
                end
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

RegisterNetEvent("jobs:client:garbage:OpenCloakroomMenu", function()
    societyMenu:ClearItems()

    societyMenu:AddButton({
        label = "Tenue civile",
        value = nil,
        select = function()
            QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
                disableMovement = true,
                disableCombat = true,
            }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
                TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
            end)
        end,
    })

    societyMenu:AddButton({
        label = "Tenue de travail",
        value = nil,
        select = function()
            QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
                disableMovement = true,
                disableCombat = true,
            }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
                TriggerEvent("soz-character:Client:ApplyTemporaryClothSet", GarbageConfig.Cloakroom[PlayerData.skin.Model.Hash])
            end)
        end,
    })

    societyMenu:Open()
end)

--- Threads
CreateThread(function()
    QBCore.Functions.CreateBlip("jobs:garbage", {
        name = "BlueBird",
        coords = vector3(-621.98, -1640.79, 25.97),
        sprite = 318,
        scale = 1.0,
    })

    while true do
        local ped = PlayerPedId()

        for _, item in pairs(PlayerData.items or {}) do
            if item.name == "garbagebag" then
                haveGarbageBag = true

                if not IsPedInAnyVehicle(ped, true) and not isPlayingGarbageAnim(ped) and not IsEntityPlayingAnim(ped, "missfbi4prepp1", "_idle_garbage_man", 3) then
                    QBCore.Functions.RequestAnimDict("missfbi4prepp1")
                    TaskPlayAnim(ped, "missfbi4prepp1", "_idle_garbage_man", 6.0, -6.0, -1, 49, 0, 0, 0, 0)
                    attachBag()
                elseif (IsPedInAnyVehicle(ped, true) or isPlayingGarbageAnim(ped)) and IsEntityPlayingAnim(ped, "missfbi4prepp1", "_idle_garbage_man", 3) then
                    StopAnimTask(ped, "missfbi4prepp1", "_idle_garbage_man", 1.0)
                    detachBag()
                end

                goto continue
            end
        end

        if IsEntityPlayingAnim(ped, "missfbi4prepp1", "_idle_garbage_man", 3) then
            StopAnimTask(ped, "missfbi4prepp1", "_idle_garbage_man", 1.0)
        end
        detachBag()
        haveGarbageBag = false

        ::continue::

        Wait(1000)
    end
end)
