local sit = false
local lastCoord = nil

local function RotationToDirection(rotation)
    local adjustedRotation = {
        x = (math.pi / 180) * rotation.x,
        y = (math.pi / 180) * rotation.y,
        z = (math.pi / 180) * rotation.z,
    }
    local direction = {
        x = -math.sin(adjustedRotation.z) * math.abs(math.cos(adjustedRotation.x)),
        y = math.cos(adjustedRotation.z) * math.abs(math.cos(adjustedRotation.x)),
        z = math.sin(adjustedRotation.x),
    }
    return direction
end

local function RayCastGamePlayCamera(distance)
    local cameraRotation = GetGameplayCamRot()
    local cameraCoord = GetGameplayCamCoord()
    local direction = RotationToDirection(cameraRotation)
    local destination = {
        x = cameraCoord.x + direction.x * distance,
        y = cameraCoord.y + direction.y * distance,
        z = cameraCoord.z + direction.z * distance,
    }
    local a, b, c, d, e = GetShapeTestResult(StartShapeTestRay(cameraCoord.x, cameraCoord.y, cameraCoord.z, destination.x, destination.y, destination.z, -1,
                                                               PlayerPedId(), 0))
    return b, c, e
end

RegisterNetEvent("soz:client:sit")
AddEventHandler("soz:client:sit", function(data)
    local player = GetPlayerPed(-1)
    local entity = getEntity(PlayerId())
    local coords = GetEntityCoords(entity)
    local heading = GetEntityHeading(entity)
    sit = true
    lastCoord = GetEntityCoords(player)
    if heading >= 180 then
        heading = heading - 179
    else
        heading = heading + 179
    end

    local angle = heading * (2 * math.pi) / 360
    SetEntityHeading(player, heading)
    SetPedCoordsKeepVehicle(player, (coords.x - (0.5 * math.sin(angle))), (coords.y + (0.5 * math.cos(angle))), coords.z - data.height)
    TriggerEvent("animations:client:EmoteCommandStart", {"sitchair"})
end)

function getEntity(player)
    local hit, coords, entity = RayCastGamePlayCamera(player)
    return entity
end

RegisterCommand("unsit", function()
    local player = GetPlayerPed(-1)
    if sit == true then
        SetPedCoordsKeepVehicle(player, lastCoord)
        sit = false
    end
end, false)

RegisterKeyMapping("unsit", "", "keyboard", "x")

local sitchair = {1580642483, -1278649385, -109356459, -1633198649, -377849416, 1037469683, 603897027}

exports["qb-target"]:AddTargetModel(sitchair, {
    options = {{event = "soz:client:sit", icon = "fas fa-coffee", label = "s'asseoir", height = 0.6}},
    distance = 2,
})

