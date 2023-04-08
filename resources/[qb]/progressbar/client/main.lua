local Action = {
    name = "",
    duration = 0,
    label = "",
    useWhileDead = false,
    canCancel = true,
    disarm = true,
    controlDisables = {
        disableMovement = false,
        disableCarMovement = false,
        disableMouse = false,
        disableCombat = false,
    },
    animation = {
        animDict = nil,
        anim = nil,
        flags = 0,
        task = nil,
    },
    prop = {
        model = nil,
        bone = nil,
        coords = { x = 0.0, y = 0.0, z = 0.0 },
        rotation = { x = 0.0, y = 0.0, z = 0.0 },
    },
    propTwo = {
        model = nil,
        bone = nil,
        coords = { x = 0.0, y = 0.0, z = 0.0 },
        rotation = { x = 0.0, y = 0.0, z = 0.0 },
    },
}

local isDoingAction = false
local disableMouse = false
local wasCancelled = false
local isAnim = false
local isProp = false
local isPropTwo = false
local prop_net = nil
local propTwo_net = nil
local runProgThread = false

local playerProps = {}
local playerHasProp = false

RegisterNetEvent('progressbar:client:ToggleBusyness', function(bool)
    isDoingAction = bool
end)

function Progress(action, finish)
    Process(action, nil, nil, finish)
end

function ProgressWithStartEvent(action, start, finish)
    Process(action, start, nil, finish)
end

function ProgressWithTickEvent(action, tick, finish)
    Process(action, nil, tick, finish)
end

function ProgressWithStartAndTick(action, start, tick, finish)
    Process(action, start, tick, finish)
end

function Process(action, start, tick, finish)
    Action = action
    ActionStart()
    local ped = PlayerPedId()
    if not IsEntityDead(ped) or Action.useWhileDead then
        if not isDoingAction then
            isDoingAction = true
            wasCancelled = false
            isAnim = false
            isProp = false

            if not Action.disableNui then
                SendNUIMessage({
                    action = "progress",
                    duration = Action.duration,
                    label = Action.label
                })
            end

            CreateThread(function()
                if start ~= nil then
                    start()
                end
                Wait(1)
                while isDoingAction do
                    if tick ~= nil then
                        tick()
                    end

                    if Action.canCancel then
                        BeginTextCommandDisplayHelp("STRING")
                        AddTextComponentSubstringPlayerName('Appuyez sur ~INPUT_FRONTEND_RRIGHT~ ou ~INPUT_CURSOR_CANCEL~ pour annuler')
                        EndTextCommandDisplayHelp(0, false, false, -1)
                        if IsControlJustPressed(0, 194) or IsControlJustPressed(0, 238) then
                            TriggerEvent("progressbar:client:cancel")
                        end
                    end

                    if IsEntityDead(ped) and not Action.useWhileDead then
                        TriggerEvent("progressbar:client:cancel")
                    end
                    Wait(1)
                end
                if finish ~= nil then
                    finish(wasCancelled)
                end
            end)
        else
            TriggerEvent("hud:client:DrawNotification", "Une action est déjà en cours !", "error")
        end
    else
        TriggerEvent("hud:client:DrawNotification", "Vous ne pouvez réaliser cette action !", "error")
    end
end

function ActionStart()
    runProgThread = true
    LocalPlayer.state:set("inv_busy", not Action.no_inv_busy, true) -- Busy
    CreateThread(function()
        while runProgThread do
            if isDoingAction then
                if not isAnim then
                    if Action.animation ~= nil then
                        if Action.animation.task ~= nil then
                            TaskStartScenarioInPlace(PlayerPedId(), Action.animation.task, 0, true)
                        elseif Action.animation.animDict ~= nil and Action.animation.anim ~= nil then
                            if Action.animation.flags == nil then
                                Action.animation.flags = 1
                            end

                            local player = PlayerPedId()
                            if (DoesEntityExist(player) and not IsEntityDead(player)) then
                                loadAnimDict(Action.animation.animDict)
                                TaskPlayAnim(player, Action.animation.animDict, Action.animation.anim, 3.0, 3.0, -1, Action.animation.flags, 0, 0, 0, 0)
                            end
                        else
                            --TaskStartScenarioInPlace(PlayerPedId(), 'PROP_HUMAN_BUM_BIN', 0, true)
                        end
                    end

                    isAnim = true
                end
                if not isProp and Action.prop ~= nil and Action.prop.model ~= nil then
                    local ped = PlayerPedId()
                    RequestModel(Action.prop.model)

                    while not HasModelLoaded(GetHashKey(Action.prop.model)) do
                        Wait(0)
                    end

                    local pCoords = GetOffsetFromEntityInWorldCoords(ped, 0.0, 0.0, 0.0)
                    local modelSpawn = CreateObject(GetHashKey(Action.prop.model), pCoords.x, pCoords.y, pCoords.z, true, true, true)

                    table.insert(playerProps, modelSpawn)
                    playerHasProp = true

                    local netid = ObjToNet(modelSpawn)
                    SetNetworkIdCanMigrate(netid, false)
                    if Action.prop.bone == nil then
                        Action.prop.bone = 60309
                    end

                    if Action.prop.coords == nil then
                        Action.prop.coords = { x = 0.0, y = 0.0, z = 0.0 }
                    end

                    if Action.prop.rotation == nil then
                        Action.prop.rotation = { x = 0.0, y = 0.0, z = 0.0 }
                    end

                    AttachEntityToEntity(modelSpawn, ped, GetPedBoneIndex(ped, Action.prop.bone), Action.prop.coords.x, Action.prop.coords.y, Action.prop.coords.z, Action.prop.rotation.x, Action.prop.rotation.y, Action.prop.rotation.z, 1, 1, 0, 1, 0, 1)
                    prop_net = netid

                    isProp = true

                    if not isPropTwo and Action.propTwo ~= nil and Action.propTwo.model ~= nil then
                        RequestModel(Action.propTwo.model)

                        while not HasModelLoaded(GetHashKey(Action.propTwo.model)) do
                            Wait(0)
                        end

                        local pCoords = GetOffsetFromEntityInWorldCoords(ped, 0.0, 0.0, 0.0)
                        local modelSpawn = CreateObject(GetHashKey(Action.propTwo.model), pCoords.x, pCoords.y, pCoords.z, true, true, true)

                        table.insert(playerProps, modelSpawn)
                        playerHasProp = true

                        local netid = ObjToNet(modelSpawn)
                        SetNetworkIdCanMigrate(netid, false)
                        if Action.propTwo.bone == nil then
                            Action.propTwo.bone = 60309
                        end

                        if Action.propTwo.coords == nil then
                            Action.propTwo.coords = { x = 0.0, y = 0.0, z = 0.0 }
                        end

                        if Action.propTwo.rotation == nil then
                            Action.propTwo.rotation = { x = 0.0, y = 0.0, z = 0.0 }
                        end

                        AttachEntityToEntity(modelSpawn, ped, GetPedBoneIndex(ped, Action.propTwo.bone), Action.propTwo.coords.x, Action.propTwo.coords.y, Action.propTwo.coords.z, Action.propTwo.rotation.x, Action.propTwo.rotation.y, Action.propTwo.rotation.z, 1, 1, 0, 1, 0, 1)
                        propTwo_net = netid

                        isPropTwo = true
                    end
                end

                DisableActions()
            end
            Wait(0)
        end
    end)
end

function Cancel()
    isDoingAction = false
    wasCancelled = true
    LocalPlayer.state:set("inv_busy", false, true) -- Not Busy
    ActionCleanup()

    SendNUIMessage({
        action = "cancel"
    })
end

function Finish()
    isDoingAction = false
    ActionCleanup()
    LocalPlayer.state:set("inv_busy", false, true) -- Not Busy
end

function ActionCleanup()
    local ped = PlayerPedId()

    if Action.animation ~= nil then
        if Action.animation.task ~= nil or (Action.animation.animDict ~= nil and Action.animation.anim ~= nil) then
            if Action.animation.animDict ~= "mp_player_inteat@burger" and Action.animation.animDict ~= "amb@world_human_drinking@coffee@male@idle_a" then
                ClearPedTasks(ped)
            end
            ClearPedSecondaryTask(ped)
            StopAnimTask(ped, Action.animDict, Action.anim, 1.0)
        else
            ClearPedTasks(ped)
        end
    end

    for _, v in pairs(playerProps) do
        DeleteEntity(v)
    end
    playerProps = {}
    playerHasProp = false

    if prop_net and NetworkDoesNetworkIdExist(prop_net) then
        DetachEntity(NetToObj(prop_net), 1, 1)
        DeleteEntity(NetToObj(prop_net))
    end
    if propTwo_net and NetworkDoesNetworkIdExist(propTwo_net) then
        DetachEntity(NetToObj(propTwo_net), 1, 1)
        DeleteEntity(NetToObj(propTwo_net))
    end
    prop_net = nil
    propTwo_net = nil
    runProgThread = false
end

function loadAnimDict(dict)
    while (not HasAnimDictLoaded(dict)) do
        RequestAnimDict(dict)
        Wait(5)
    end
end

function DisableActions()
    if Action.controlDisables.disableMouse then
        DisableControlAction(0, 1, true) -- LookLeftRight
        DisableControlAction(0, 2, true) -- LookUpDown
        DisableControlAction(0, 106, true) -- VehicleMouseControlOverride
    end

    if Action.controlDisables.disableMovement then
        DisableControlAction(0, 22, true) -- disable spacebar
        DisableControlAction(0, 23, true) -- disable enter vehicle
        DisableControlAction(0, 30, true) -- disable left/right
        DisableControlAction(0, 31, true) -- disable forward/back
        DisableControlAction(0, 36, true) -- INPUT_DUCK
        DisableControlAction(0, 21, true) -- disable sprint
    end

    if Action.controlDisables.disableCarMovement then
        DisableControlAction(0, 63, true) -- veh turn left
        DisableControlAction(0, 64, true) -- veh turn right
        DisableControlAction(0, 71, true) -- veh forward
        DisableControlAction(0, 72, true) -- veh backwards
        DisableControlAction(0, 75, true) -- disable exit vehicle
    end

    if Action.controlDisables.disableCombat then
        DisablePlayerFiring(PlayerId(), true) -- Disable weapon firing
        DisableControlAction(0, 24, true) -- disable attack
        DisableControlAction(0, 25, true) -- disable aim
        DisableControlAction(0, 29, true) -- disable ability secondary (B)
        DisableControlAction(0, 44, true) -- disable cover
        DisableControlAction(1, 37, true) -- disable weapon select
        DisableControlAction(0, 47, true) -- disable weapon
        DisableControlAction(0, 58, true) -- disable weapon
        DisableControlAction(0, 140, true) -- disable melee
        DisableControlAction(0, 141, true) -- disable melee
        DisableControlAction(0, 142, true) -- disable melee
        DisableControlAction(0, 143, true) -- disable melee
        DisableControlAction(0, 263, true) -- disable melee
        DisableControlAction(0, 264, true) -- disable melee
        DisableControlAction(0, 257, true) -- disable melee
    end
end

RegisterNetEvent('progressbar:client:progress', function(action, finish)
    Process(action, nil, nil, finish)
end)

RegisterNetEvent('progressbar:client:ProgressWithStartEvent', function(action, start, finish)
    Process(action, start, nil, finish)
end)

RegisterNetEvent('progressbar:client:ProgressWithTickEvent', function(action, tick, finish)
    Process(action, nil, tick, finish)
end)

RegisterNetEvent('progressbar:client:ProgressWithStartAndTick', function(action, start, tick, finish)
    Process(action, start, tick, finish)
end)

RegisterNetEvent('progressbar:client:cancel', function()
    Cancel()
end)

RegisterNUICallback('FinishAction', function(data, cb)
    Finish()
end)

exports("IsDoingAction", function()
    return isDoingAction
end)
