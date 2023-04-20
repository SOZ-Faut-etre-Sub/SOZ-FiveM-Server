--- @class DrawPolyZone
DrawPolyZone = {}

function DrawPolyZone:new()
    self.__index = self

    return setmetatable({ zones = {}, displayLabel = false }, self)
end

---
--- Internal functions
---

--- @private
function DrawPolyZone:CalculatePoints(center, length, width)
    local halfLength, halfWidth = length / 2, width / 2
    local min = vector2(-halfWidth, -halfLength)
    local max = vector2(halfWidth, halfLength)

    -- Box vertices
    local p1 = center.xy + vector2(min.x, min.y)
    local p2 = center.xy + vector2(min.x, max.y)
    local p3 = center.xy + vector2(max.x, max.y)
    local p4 = center.xy + vector2(max.x, min.y)

    return p1, p2, p3, p4
end

--- @private
function DrawPolyZone:DrawText3D(x, y, z, text)
    local onScreen, x, y = GetScreenCoordFromWorldCoord(x, y, z)

    if onScreen then
        SetTextScale(0.35, 0.35)
        SetTextFont(4)
        SetTextProportional(1)
        SetTextColour(255, 255, 255, 215)
        BeginTextCommandDisplayText("STRING")
        SetTextCentre(1)
        AddTextComponentSubstringPlayerName(text)
        DrawText(x, y)
    end
end

--- @private
function DrawPolyZone:Draw(zone, extra)
    if type(zone) ~= "table" then
        zone = json.decode(zone)
    end
    local zDrawDist = 45.0
    local plyPed = PlayerPedId()
    local plyPos = GetEntityCoords(plyPed)
    local minZ = zone.minZ or plyPos.z - zDrawDist
    local maxZ = zone.maxZ or plyPos.z + zDrawDist
    local angle = zone.heading * (2 * math.pi) / 360

    local cp1, cp2, cp3, cp4 = self:CalculatePoints(vector3(zone.x, zone.y, zone.z), zone.sx, zone.sy)
    local p1 = vector2((math.cos(angle) * (cp1.x - zone.x) - math.sin(angle) * (cp1.y - zone.y) + zone.x),
        (math.sin(angle) * (cp1.x - zone.x) + math.cos(angle) * (cp1.y - zone.y) + zone.y))
    local p2 = vector2((math.cos(angle) * (cp2.x - zone.x) - math.sin(angle) * (cp2.y - zone.y) + zone.x),
        (math.sin(angle) * (cp2.x - zone.x) + math.cos(angle) * (cp2.y - zone.y) + zone.y))
    local p3 = vector2((math.cos(angle) * (cp3.x - zone.x) - math.sin(angle) * (cp3.y - zone.y) + zone.x),
        (math.sin(angle) * (cp3.x - zone.x) + math.cos(angle) * (cp3.y - zone.y) + zone.y))
    local p4 = vector2((math.cos(angle) * (cp4.x - zone.x) - math.sin(angle) * (cp4.y - zone.y) + zone.x),
        (math.sin(angle) * (cp4.x - zone.x) + math.cos(angle) * (cp4.y - zone.y) + zone.y))

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

    if self.displayLabel then
        self:DrawText3D(zone.x, zone.y, zone.z, "Zone " .. extra)
    end
end

function DrawPolyZone:ConvertToDto(polyZone)
    local data = {
        x = QBCore.Shared.Round(polyZone.center.x, 2),
        y = QBCore.Shared.Round(polyZone.center.y, 2),
        z = QBCore.Shared.Round(polyZone.center.z, 2),
        sx = polyZone.length,
        sy = polyZone.width,
        heading = polyZone.heading,
    }

    if polyZone.maxZ then
        data.maxZ = QBCore.Shared.Round(polyZone.maxZ, 2)
    else
        data.maxZ = data.z + 1.5
    end
    if polyZone.minZ then
        data.minZ = QBCore.Shared.Round(polyZone.minZ, 2)
    else
        data.minZ = data.z - 1.0
    end

    return data
end

---
--- Interfaces
---
function DrawPolyZone:AddZone(name, zone)
    if not self.zones[name] then
        self.zones[name] = zone
    end
end

function DrawPolyZone:SetZone(name, zone)
    if self.zones[name] then
        self.zones[name] = zone
    end
end

function DrawPolyZone:RemoveZone(name)
    self.zones[name] = nil
end

function DrawPolyZone:SetDisplayLabel(value)
    self.displayLabel = value
end

function DrawPolyZone:DrawZone(zone)
    self:Draw(self.zones[zone], zone)
end
