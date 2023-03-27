local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_garbage", "soz", "garbage:menu")
local societyMenuState = {["displayCollect"] = false}

local haveGarbageBag, garbageBagProp = false, nil
local binModel, binLocation = GetHashKey("soz_prop_bb_bin"), {}

CreateThread(function()
    exports["qb-target"]:AddBoxZone("garbage:duty", vector3(-615.5, -1622.18, 33.01), 0.6, 0.6,
                                    {name = "garbage:cloakroom", heading = 59, minZ = 32.70, maxZ = 33.30},
                                    {options = SozJobCore.Functions.GetDutyActions("garbage"), distance = 2.5})

    local props = QBCore.Functions.TriggerRpc("core:server:getProps")
    for _, prop in pairs(props) do
        if prop.model == binModel then
            binLocation[prop.id] = prop
        end
    end
end)

--- Functions
local function isPlayingGarbageAnim(ped)
    return IsEntityPlayingAnim(ped, "missfbi4prepp1", "_bag_pickup_garbage_man", 3) or IsEntityPlayingAnim(ped, "missfbi4prepp1", "_bag_throw_garbage_man", 3)
end

HasExpiredItems = function()
    for _, item in pairs(PlayerData.items or {}) do
        if exports["soz-utils"]:ItemIsExpired(item) then
            return true
        end
    end
    return false
end

local attachBag = function()
    if garbageBagProp == nil then
        local player = PlayerPedId()
        garbageBagProp = CreateObject(GetHashKey("prop_cs_rub_binbag_01"), GetEntityCoords(player), true)
        SetNetworkIdCanMigrate(ObjToNet(garbageBagProp), false)
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
RegisterNetEvent("jobs:client:garbage:OpenSocietyMenu", function()
    if societyMenu.IsOpen then
        societyMenu:Close()
        return
    end
    societyMenu:ClearItems()

    if PlayerData.job.onduty then
        societyMenu:AddCheckbox({
            label = "Afficher les points de collecte",
            value = societyMenuState.displayCollect,
            change = function(_, checked)
                societyMenuState.displayCollect = checked
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

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    PlayerData.job.onduty = duty
    if not PlayerData.job.onduty then
        for binId, bin in pairs(binLocation) do
            local blip = QBCore.Functions.GetBlip("garbage_bin_" .. binId)
            if blip ~= nil then
                QBCore.Functions.RemoveBlip("garbage_bin_" .. binId)
            end
        end
    end
end)
