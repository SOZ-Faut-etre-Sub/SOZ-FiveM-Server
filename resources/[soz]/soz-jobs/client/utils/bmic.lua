BMicConfig = {
    enabled = false,
    prop = "prop_v_bmike_01",
    animDict = "missfra1",
    anim = "mcs2_crew_idle_m_boom",
    object = nil,
}

--- Bmic
local spawnBmicObject = function()
    QBCore.Functions.RequestModel(BMicConfig.prop)
    local player = PlayerPedId()
    local plyCoords = GetOffsetFromEntityInWorldCoords(player, 0.0, 0.0, -5.0)

    BMicConfig.object = CreateObject(GetHashKey(BMicConfig.prop), plyCoords.x, plyCoords.y, plyCoords.z, true, true, false)
    SetNetworkIdCanMigrate(ObjToNet(BMicConfig.object), false)
    AttachEntityToEntity(BMicConfig.object, player, GetPedBoneIndex(player, 28422), -0.08, 0.0, 0.0, 0.0, 0.0, 0.0, 1, 1, 0, 1, 0, 1)
end

local deleteBmicObject = function()
    DetachEntity(BMicConfig.object, 1, 1)
    DeleteEntity(BMicConfig.object)
    BMicConfig.object = nil
end

local createBmicThread = function()
    CreateThread(function()
        local player = PlayerPedId()

        while BMicConfig.enabled do
            QBCore.Functions.RequestAnimDict(BMicConfig.animDict)

            if not IsEntityPlayingAnim(player, BMicConfig.animDict, BMicConfig.anim, 3) then
                TaskPlayAnim(player, BMicConfig.animDict, BMicConfig.anim, 1.0, -1, -1, 50, 0, 0, 0, 0)
            end

            Wait(7)
        end

        StopAnimTask(player, BMicConfig.animDict, BMicConfig.anim, 1.0)
    end)
end

local bmicOperator = function()
    if BMicConfig.enabled then
        if BMicConfig.object == nil then
            spawnBmicObject()
        end
        createBmicThread()
    else
        if BMicConfig.object ~= nil then
            deleteBmicObject()
        end
    end
end

--- Toggle Events
RegisterNetEvent("jobs:utils:bmic:toggle", function()
    if CameraConfig.enabled then
        return
    end

    BMicConfig.enabled = not BMicConfig.enabled
    bmicOperator()
end)

--- Set state Events
RegisterNetEvent("jobs:utils:bmic:set", function(value)
    BMicConfig.enabled = value
    bmicOperator()
end)

AddEventHandler("ems:client:onDeath", function()
    BMicConfig.enabled = false
    deleteBmicObject()
end)
