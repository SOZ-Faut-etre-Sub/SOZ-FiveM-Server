local haveGarbageBag, garbageBagProp = false, nil

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
        local netId = ObjToNet(garbageBagProp)
        TriggerServerEvent("soz-core:client:object:attached:register", netId)
        SetNetworkIdCanMigrate(netId, false)
        AttachEntityToEntity(garbageBagProp, player, GetPedBoneIndex(player, 57005), 0.12, 0.0, -0.05, 220.0, 120.0, 0.0, true, true, false, true, 1, true)
    end
end

local detachBag = function()
    if garbageBagProp ~= nil then
        DetachEntity(garbageBagProp, true, false)
        TriggerServerEvent("soz-core:client:object:attached:unregister", ObjToNet(garbageBagProp))
        DeleteObject(garbageBagProp)
        garbageBagProp = nil
    end
end

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
