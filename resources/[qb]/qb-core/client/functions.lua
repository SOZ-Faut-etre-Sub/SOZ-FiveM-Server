QBCore.Functions = {}
Blips = Blips or {}
QBCore.RequestId = 0

-- Player

function QBCore.Functions.GetPlayerData(cb)
    if cb then
        cb(QBCore.PlayerData)
    else
        return QBCore.PlayerData
    end
end

function QBCore.Functions.GetCoords(entity)
    local coords = GetEntityCoords(entity, false)
    local heading = GetEntityHeading(entity)
    return vector4(coords.x, coords.y, coords.z, heading)
end

function QBCore.Functions.GetProperGroundCoord(obj, position, heading, offset)
    --- Generate ghost spike
    local object = CreateObject(obj, position.x, position.y, position.z, false)
    SetEntityVisible(object, false)
    SetEntityHeading(object, heading)
    PlaceObjectOnGroundProperly(object)

    --- Clean entity
    position = GetEntityCoords(object)
    DeleteObject(object)

    return vector4(position.x, position.y, position.z + (offset or 0.0), heading)
end

function QBCore.Functions.HasItem(item)
    local p = promise.new()
    QBCore.Functions.TriggerCallback('QBCore:HasItem', function(result)
        if result then
            p:resolve(true)
        end
        p:resolve(false)
    end, item)

    return Citizen.Await(p)
end

-- Utility

function QBCore.Functions.ShowHelpNotification(msg)
    BeginTextCommandDisplayHelp("STRING")
    AddTextComponentSubstringPlayerName(msg)
    EndTextCommandDisplayHelp(0, false, false, -1)
end

function QBCore.Functions.DrawText(x, y, width, height, scale, r, g, b, a, text)
    -- Use local function instead
    SetTextFont(4)
    SetTextProportional(0)
    SetTextScale(scale, scale)
    SetTextColour(r, g, b, a)
    SetTextDropShadow(0, 0, 0, 0, 255)
    SetTextEdge(2, 0, 0, 0, 255)
    SetTextDropShadow()
    SetTextOutline()
    SetTextEntry('STRING')
    AddTextComponentString(text)
    DrawText(x - width / 2, y - height / 2 + 0.005)
end

function QBCore.Functions.DrawText3D(x, y, z, text)
    -- Use local function instead
    SetTextScale(0.35, 0.35)
    SetTextFont(4)
    SetTextProportional(1)
    SetTextColour(255, 255, 255, 215)
    SetTextEntry('STRING')
    SetTextCentre(true)
    AddTextComponentString(text)
    SetDrawOrigin(x, y, z, 0)
    DrawText(0.0, 0.0)
    local factor = (string.len(text)) / 370
    DrawRect(0.0, 0.0 + 0.0125, 0.017 + factor, 0.03, 0, 0, 0, 75)
    ClearDrawOrigin()
end

function QBCore.Functions.CreateBlip(id, data)
    local blip = AddBlipForCoord(data.coords.x, data.coords.y, data.coords.z)

    if data.sprite then SetBlipSprite(blip, tonumber(data.sprite)) end
    if data.range then SetBlipAsShortRange(blip, data.range) else SetBlipAsShortRange(blip, true) end
    if data.color then SetBlipColour(blip, data.color) end
    if data.alpha then SetBlipAlpha(blip, data.alpha or 255) end
    if data.display then SetBlipDisplay(blip, data.display) end
    if data.playername then SetBlipNameToPlayerName(blip, data.playername) end
    if data.showcone then SetBlipShowCone(blip, data.showcone) end
    if data.heading then SetBlipRotation(blip, math.ceil(data.heading)) end
    if data.showheading then ShowHeadingIndicatorOnBlip(blip, data.showheading) end
    if data.secondarycolor then SetBlipSecondaryColour(blip, data.secondarycolor) end
    if data.friend then ShowFriendIndicatorOnBlip(blip, data.friend) end
    if data.mission then SetBlipAsMissionCreatorBlip(blip, data.mission) end
    if data.route then SetBlipRoute(blip, data.route) end
    if data.friendly then SetBlipAsFriendly(blip, data.friendly) end
    if data.routecolor then SetBlipRouteColour(blip, data.routecolor) end
    if data.scale then SetBlipScale(blip, data.scale) else SetBlipScale(blip, 0.8) end

    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString(data.name)
    EndTextCommandSetBlipName(blip)

    Blips[id] = {blip = blip, data = data}
    return blip
end

function QBCore.Functions.RemoveBlip(id)
    local blip = Blips[id]
    if blip then RemoveBlip(blip.blip) end
    Blips[id] = nil
end

function QBCore.Functions.HideBlip(id, toggle)
    local blip = Blips[id]
    if not blip then return end
    if toggle then
        SetBlipAlpha(blip.blip, 0)
        SetBlipHiddenOnLegend(blip.blip, true)
    else
        SetBlipAlpha(blip.blip, 255)
        SetBlipHiddenOnLegend(blip.blip, false)
    end
end

function QBCore.Functions.GetBlip(id)
    local blip = Blips[id]
    if not blip then return false end
    return blip
end

function QBCore.Functions.RequestModel(model)
    if type(model) == 'string' then
        model = GetHashKey(model)
    end

    RequestModel(model)
    while not HasModelLoaded(model) do
        Wait(4)
    end
end

function QBCore.Functions.RequestAnimDict(animDict)
	if not HasAnimDictLoaded(animDict) then
		RequestAnimDict(animDict)

		while not HasAnimDictLoaded(animDict) do
			Wait(4)
		end
	end
end

function QBCore.Debug(resource, obj, depth)
    TriggerServerEvent('QBCore:DebugSomething', resource, obj, depth)
end

function QBCore.Functions.TriggerCallback(name, cb, ...)
    QBCore.ServerCallbacks[name] = cb
    TriggerServerEvent('QBCore:Server:TriggerCallback', name, ...)
end

function QBCore.Functions.TriggerRpc(name, ...)
    local eventResponseId = QBCore.Shared.UuidV4()
    local p = promise.new()

    local event = RegisterNetEvent(eventResponseId, function(result)
        RemoveEventHandler(QBCore.ServerRPC[eventResponseId].event)
        QBCore.ServerRPC[eventResponseId] = nil
        p:resolve(result)
    end)

    QBCore.ServerRPC[eventResponseId] = {
        name = name,
        args = {...},
        promise = p,
        event = event,
    }

    Citizen.SetTimeout(2000, function()
        if QBCore.ServerRPC[eventResponseId] then
            p:reject('RPC timed out for event: ' .. QBCore.ServerRPC[eventResponseId].name)
            RemoveEventHandler(QBCore.ServerRPC[eventResponseId].event)
            QBCore.ServerRPC[eventResponseId] = nil
        end
    end)

    TriggerServerEvent('QBCore:Server:TriggerRpc', name, eventResponseId, ...)

    return Citizen.Await(p)
end

function QBCore.Functions.Progressbar(name, label, duration, useWhileDead, canCancel, disableControls, animation, prop, propTwo, onFinish, onCancel)
    exports['progressbar']:Progress({
        name = name:lower(),
        duration = exports["soz-upw"]:CalculateDuration(duration),
        label = label,
        useWhileDead = useWhileDead,
        canCancel = canCancel,
        controlDisables = disableControls,
        animation = animation,
        prop = prop,
        propTwo = propTwo,
    }, function(cancelled)
        if not cancelled then
            if onFinish then
                onFinish()
            end
        else
            if onCancel then
                onCancel()
            end
        end
    end)
end

-- Getters

function QBCore.Functions.GetVehicles()
    return GetGamePool('CVehicle')
end
function QBCore.Functions.GetObjects()
    return GetGamePool('CObject')
end
function QBCore.Functions.GetPlayers()
    return GetActivePlayers()
end

function QBCore.Functions.GetPeds(ignoreList)
    local pedPool = GetGamePool('CPed')
    local ignoreList = ignoreList or {}
    local peds = {}
    for i = 1, #pedPool, 1 do
        local found = false
        for j = 1, #ignoreList, 1 do
            if ignoreList[j] == pedPool[i] then
                found = true
            end
        end
        if not found then
            peds[#peds + 1] = pedPool[i]
        end
    end
    return peds
end

function QBCore.Functions.GetClosestPed(coords, ignoreList)
    local ped = PlayerPedId()
    if coords then
        coords = type(coords) == 'table' and vec3(coords.x, coords.y, coords.z) or coords
    else
        coords = GetEntityCoords(ped)
    end
    local ignoreList = ignoreList or {}
    local peds = QBCore.Functions.GetPeds(ignoreList)
    local closestDistance = -1
    local closestPed = -1
    for i = 1, #peds, 1 do
        local pedCoords = GetEntityCoords(peds[i])
        local distance = #(pedCoords - coords)

        if closestDistance == -1 or closestDistance > distance then
            closestPed = peds[i]
            closestDistance = distance
        end
    end
    return closestPed, closestDistance
end

function QBCore.Functions.GetClosestPlayer(coords)
    local ped = PlayerPedId()
    if coords then
        coords = type(coords) == 'table' and vec3(coords.x, coords.y, coords.z) or coords
    else
        coords = GetEntityCoords(ped)
    end
    local closestPlayers = QBCore.Functions.GetPlayersFromCoords(coords)
    local closestDistance = -1
    local closestPlayer = -1
    for i = 1, #closestPlayers, 1 do
        if closestPlayers[i] ~= PlayerId() and closestPlayers[i] ~= -1 then
            local pos = GetEntityCoords(GetPlayerPed(closestPlayers[i]))
            local distance = #(pos - coords)

            if closestDistance == -1 or closestDistance > distance then
                closestPlayer = closestPlayers[i]
                closestDistance = distance
            end
        end
    end
    return closestPlayer, closestDistance
end

function QBCore.Functions.GetPlayersFromCoords(coords, distance)
    local players = QBCore.Functions.GetPlayers()
    local ped = PlayerPedId()
    if coords then
        coords = type(coords) == 'table' and vec3(coords.x, coords.y, coords.z) or coords
    else
        coords = GetEntityCoords(ped)
    end
    local distance = distance or 5
    local closePlayers = {}
    for _, player in pairs(players) do
        local target = GetPlayerPed(player)
        local targetCoords = GetEntityCoords(target)
        local targetdistance = #(targetCoords - coords)
        if targetdistance <= distance then
            closePlayers[#closePlayers + 1] = player
        end
    end
    return closePlayers
end

function QBCore.Functions.GetVehicleInDirection()
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    local inDirection = GetOffsetFromEntityInWorldCoords(ped, 0.0, 5.0, 0.0)
    local rayHandle = StartExpensiveSynchronousShapeTestLosProbe(coords, inDirection, 10, ped, 0)
    local _, hit, _, _, entityHit = GetShapeTestResult(rayHandle)

    if hit == 1 and GetEntityType(entityHit) == 2 then
        local entityCoords = GetEntityCoords(entityHit)
        return entityHit, entityCoords
    end

    return nil
end

function QBCore.Functions.GetClosestVehicle(coords)
    local ped = PlayerPedId()
    local vehicles = GetGamePool('CVehicle')
    local closestDistance = -1
    local closestVehicle = -1
    if coords then
        coords = type(coords) == 'table' and vec3(coords.x, coords.y, coords.z) or coords
    else
        coords = GetEntityCoords(ped)
    end
    for i = 1, #vehicles, 1 do
        local vehicleCoords = GetEntityCoords(vehicles[i])
        local distance = #(vehicleCoords - coords)

        if closestDistance == -1 or closestDistance > distance then
            closestVehicle = vehicles[i]
            closestDistance = distance
        end
    end
    return closestVehicle, closestDistance
end

function QBCore.Functions.GetClosestObject(coords)
    local ped = PlayerPedId()
    local objects = GetGamePool('CObject')
    local closestDistance = -1
    local closestObject = -1
    if coords then
        coords = type(coords) == 'table' and vec3(coords.x, coords.y, coords.z) or coords
    else
        coords = GetEntityCoords(ped)
    end
    for i = 1, #objects, 1 do
        local objectCoords = GetEntityCoords(objects[i])
        local distance = #(objectCoords - coords)
        if closestDistance == -1 or closestDistance > distance then
            closestObject = objects[i]
            closestDistance = distance
        end
    end
    return closestObject, closestDistance
end

function QBCore.Functions.GetClosestBone(entity, list)
    local playerCoords, bone, coords, distance = GetEntityCoords(PlayerPedId())

    for _, element in pairs(list) do
        local boneCoords = GetWorldPositionOfEntityBone(entity, element.id or element)
        local boneDistance = #(playerCoords - boneCoords)

        if not coords then
            bone, coords, distance = element, boneCoords, boneDistance
        elseif distance > boneDistance then
            bone, coords, distance = element, boneCoords, boneDistance
        end
    end

    if not bone then
        bone = {id = GetEntityBoneIndexByName(entity, "bodyshell"), type = "remains", name = "bodyshell"}
        coords = GetWorldPositionOfEntityBone(entity, bone.id)
        distance = #(coords - playerCoords)
    end

    return bone, coords, distance
end

function QBCore.Functions.GetBoneDistance(entity, Type, Bone)
    local bone

    if Type == 1 then
        bone = GetPedBoneIndex(entity, Bone)
    else
        bone = GetEntityBoneIndexByName(entity, Bone)
    end

    local boneCoords = GetWorldPositionOfEntityBone(entity, bone)
    local playerCoords = GetEntityCoords(PlayerPedId())

    return #(boneCoords - playerCoords)
end
