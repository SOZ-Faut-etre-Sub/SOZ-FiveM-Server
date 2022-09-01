MicConfig = {
    enabled = false,
    prop = "p_ing_microphonel_01",
    animDict = "anim@random@shop_clothes@watches",
    anim = "base",
    object = nil,
}

--- Mic
local spawnMicObject = function()
    QBCore.Functions.RequestModel(MicConfig.prop)
    QBCore.Functions.RequestAnimDict(MicConfig.animDict)

    local player = PlayerPedId()
    local coords = GetEntityCoords(player)

    MicConfig.object = CreateObject(GetHashKey(MicConfig.prop), coords.x, coords.y, coords.z, 1, 1, 1)
    SetNetworkIdCanMigrate(ObjToNet(MicConfig.object), false)
    AttachEntityToEntity(MicConfig.object, player, GetPedBoneIndex(player, 60309), 0.1, 0.05, 0.0, 230.0, -30.0, 0.0, 1, 1, 0, 1, 0, 1)
end

local deleteMicObject = function()
    DetachEntity(MicConfig.object, 1, 1)
    DeleteEntity(MicConfig.object)
    MicConfig.object = nil
end

local createMicThread = function()
    CreateThread(function()
        local player = PlayerPedId()

        while MicConfig.enabled do
            QBCore.Functions.RequestAnimDict(MicConfig.animDict)

            if not IsEntityPlayingAnim(player, MicConfig.animDict, MicConfig.anim, 3) then
                TaskPlayAnim(player, MicConfig.animDict, MicConfig.anim, 1.0, -1, -1, 50, 0, 0, 0, 0)
            end

            Wait(7)
        end

        StopAnimTask(player, MicConfig.animDict, MicConfig.anim, 1.0)
    end)
end

local micOperator = function()
    if MicConfig.enabled then
        if MicConfig.object == nil then
            spawnMicObject()
        end
        createMicThread()
    else
        if MicConfig.object ~= nil then
            deleteMicObject()
        end
    end
end

--- Toggle Events
RegisterNetEvent("jobs:utils:mic:toggle", function()
    if CameraConfig.enabled or BMicConfig.enabled then
        return
    end

    TriggerEvent('talk:microphone:use');
    MicConfig.enabled = not MicConfig.enabled
    micOperator()
end)

--- Set state Events
RegisterNetEvent("jobs:utils:mic:set", function(value)
    MicConfig.enabled = value
    micOperator()
end)

AddEventHandler("ems:client:onDeath", function()
    MicConfig.enabled = false
    deleteMicObject()
end)
