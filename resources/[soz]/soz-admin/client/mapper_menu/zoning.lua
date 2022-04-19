lastCreatedZoneType = nil
lastCreatedZone = nil
createdZoneType = nil
createdZone = nil
drawZone = false

-- zone display

local function _calculatePoints(center, length, width)
    local halfLength, halfWidth = length / 2, width / 2
    local min = vector2(-halfWidth, -halfLength)
    local max = vector2(halfWidth, halfLength)
  
    -- Box vertices
    p1 = center.xy + vector2(min.x, min.y)
    p3 = center.xy + vector2(max.x, max.y)
end

function DisplayZone(zone)
    local zDrawDist = 45.0
    local plyPed = PlayerPedId()
    local plyPos = GetEntityCoords(plyPed)
    local minZ = zone.minZ or plyPos.z - zDrawDist
    local maxZ = zone.maxZ or plyPos.z + zDrawDist

    _calculatePoints(vector3(zone.x, zone.y, zone.z), zone.sx, zone.sy)
    while true do
        DrawBox(p1.x, p1.y, minZ, p3.x, p3.y, maxZ, 93, 173, 226, 50)
        Wait(1)
    end
end