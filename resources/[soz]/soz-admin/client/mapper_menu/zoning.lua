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
    p2 = center.xy + vector2(min.x, max.y)
    p3 = center.xy + vector2(max.x, max.y)
    p4 = center.xy + vector2(max.x, min.y)
end

function DisplayZone(zone)
    local zDrawDist = 45.0
    local plyPed = PlayerPedId()
    local plyPos = GetEntityCoords(plyPed)
    local minZ = zone.minZ or plyPos.z - zDrawDist
    local maxZ = zone.maxZ or plyPos.z + zDrawDist
    local angle = zone.heading * (2 * math.pi) / 360

    _calculatePoints(vector3(zone.x, zone.y, zone.z), zone.sx, zone.sy)
    p1 = vector2((math.cos(angle) * (p1.x - zone.x) - math.sin(angle) * (p1.y - zone.y) + zone.x),(math.sin(angle) * (p1.x - zone.x) + math.cos(angle) * (p1.y - zone.y) + zone.y))
    p2 = vector2((math.cos(angle) * (p2.x - zone.x) - math.sin(angle) * (p2.y - zone.y) + zone.x),(math.sin(angle) * (p2.x - zone.x) + math.cos(angle) * (p2.y - zone.y) + zone.y))
    p3 = vector2((math.cos(angle) * (p3.x - zone.x) - math.sin(angle) * (p3.y - zone.y) + zone.x),(math.sin(angle) * (p3.x - zone.x) + math.cos(angle) * (p3.y - zone.y) + zone.y))
    p4 = vector2((math.cos(angle) * (p4.x - zone.x) - math.sin(angle) * (p4.y - zone.y) + zone.x),(math.sin(angle) * (p4.x - zone.x) + math.cos(angle) * (p4.y - zone.y) + zone.y))

    local wall1 = {
        bottomLeft = vector3(p1.x, p1.y, minZ),
        topLeft = vector3(p1.x, p1.y, maxZ),
        bottomRight = vector3(p2.x, p2.y, minZ),
        topRight = vector3(p2.x, p2.y, maxZ),
    }

    local wall2 = {
        bottomLeft = vector3(p2.x, p2.y, minZ),
        topLeft = vector3(p2.x, p2.y, maxZ),
        bottomRight = vector3(p3.x, p3.y, minZ),
        topRight = vector3(p3.x, p3.y, maxZ),
    }

    local wall3 = {
        bottomLeft = vector3(p3.x, p3.y, minZ),
        topLeft = vector3(p3.x, p3.y, maxZ),
        bottomRight = vector3(p4.x, p4.y, minZ),
        topRight = vector3(p4.x, p4.y, maxZ),
    }

    local wall4 = {
        bottomLeft = vector3(p4.x, p4.y, minZ),
        topLeft = vector3(p4.x, p4.y, maxZ),
        bottomRight = vector3(p1.x, p1.y, minZ),
        topRight = vector3(p1.x, p1.y, maxZ),
    }

    while drawZone do
        DrawLine(p1.x, p1.y, minZ, p2.x, p2.y, minZ, 126, 0, 255, 255)
        DrawLine(p2.x, p2.y, minZ, p3.x, p3.y, minZ, 126, 0, 255, 255)
        DrawLine(p3.x, p3.y, minZ, p4.x, p4.y, minZ, 126, 0, 255, 255)
        DrawLine(p4.x, p4.y, minZ, p1.x, p1.y, minZ, 126, 0, 255, 255)
        --
        DrawLine(p1.x, p1.y, maxZ, p2.x, p2.y, maxZ, 126, 0, 255, 255)
        DrawLine(p2.x, p2.y, maxZ, p3.x, p3.y, maxZ, 126, 0, 255, 255)
        DrawLine(p3.x, p3.y, maxZ, p4.x, p4.y, maxZ, 126, 0, 255, 255)
        DrawLine(p4.x, p4.y, maxZ, p1.x, p1.y, maxZ, 126, 0, 255, 255)
        --
        DrawLine(p1.x, p1.y, minZ, p1.x, p1.y, maxZ, 126, 0, 255, 255)
        DrawLine(p2.x, p2.y, minZ, p2.x, p2.y, maxZ, 126, 0, 255, 255)
        DrawLine(p3.x, p3.y, minZ, p3.x, p3.y, maxZ, 126, 0, 255, 255)
        DrawLine(p4.x, p4.y, minZ, p4.x, p4.y, maxZ, 126, 0, 255, 255)
        --
        DrawPoly(wall1.bottomLeft, wall1.topLeft, wall1.bottomRight, 93, 173, 226, 75)
        DrawPoly(wall1.topLeft, wall1.topRight, wall1.bottomRight, 93, 173, 226, 75)
        DrawPoly(wall1.bottomRight, wall1.topRight, wall1.topLeft, 93, 173, 226, 75)
        DrawPoly(wall1.bottomRight, wall1.topLeft, wall1.bottomLeft, 93, 173, 226, 75)
        --       
        DrawPoly(wall2.bottomLeft, wall2.topLeft, wall2.bottomRight, 93, 173, 226, 75)
        DrawPoly(wall2.topLeft, wall2.topRight, wall2.bottomRight, 93, 173, 226, 75)
        DrawPoly(wall2.bottomRight, wall2.topRight, wall2.topLeft, 93, 173, 226, 75)
        DrawPoly(wall2.bottomRight, wall2.topLeft, wall2.bottomLeft, 93, 173, 226, 75)        
        --       
        DrawPoly(wall3.bottomLeft, wall3.topLeft, wall3.bottomRight, 93, 173, 226, 75)
        DrawPoly(wall3.topLeft, wall3.topRight, wall3.bottomRight, 93, 173, 226, 75)
        DrawPoly(wall3.bottomRight, wall3.topRight, wall3.topLeft, 93, 173, 226, 75)
        DrawPoly(wall3.bottomRight, wall3.topLeft, wall3.bottomLeft, 93, 173, 226, 75) 
        --       
        DrawPoly(wall4.bottomLeft, wall4.topLeft, wall4.bottomRight, 93, 173, 226, 75)
        DrawPoly(wall4.topLeft, wall4.topRight, wall4.bottomRight, 93, 173, 226, 75)
        DrawPoly(wall4.bottomRight, wall4.topRight, wall4.topLeft, 93, 173, 226, 75)
        DrawPoly(wall4.bottomRight, wall4.topLeft, wall4.bottomLeft, 93, 173, 226, 75) 

        Wait(1)
    end
end
