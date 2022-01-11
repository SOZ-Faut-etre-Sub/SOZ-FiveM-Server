--- DrawText method wrapper, draws text to the screen.
--- @param1 string The text to draw
--- @param2 float Screen x-axis coordinate
--- @param3 float Screen y-axis coordinate
--- @param4 table Optional. Styles to apply to the text
--- @return
function drawText(str, x, y, style)
    if style == nil then
        style = {}
    end

    SetTextFont((style.font ~= nil) and style.font or 0)
    SetTextScale(0.0, (style.size ~= nil) and style.size or 1.0)
    SetTextProportional(1)

    if style.colour ~= nil then
        SetTextColour(style.colour.r ~= nil and style.colour.r or 255, style.colour.g ~= nil and style.colour.g or 255,
                      style.colour.b ~= nil and style.colour.b or 255, style.colour.a ~= nil and style.colour.a or 255)
    else
        SetTextColour(255, 255, 255, 255)
    end

    if style.shadow ~= nil then
        SetTextDropShadow(style.shadow.distance ~= nil and style.shadow.distance or 0, style.shadow.r ~= nil and style.shadow.r or 0,
                          style.shadow.g ~= nil and style.shadow.g or 0, style.shadow.b ~= nil and style.shadow.b or 0,
                          style.shadow.a ~= nil and style.shadow.a or 255)
    else
        SetTextDropShadow(0, 0, 0, 0, 255)
    end

    if style.border ~= nil then
        SetTextEdge(style.border.size ~= nil and style.border.size or 1, style.border.r ~= nil and style.border.r or 0,
                    style.border.g ~= nil and style.border.g or 0, style.border.b ~= nil and style.border.b or 0,
                    style.border.a ~= nil and style.shadow.a or 255)
    end

    if style.centered ~= nil and style.centered == true then
        SetTextCentre(true)
    end

    if style.outline ~= nil and style.outline == true then
        SetTextOutline()
    end

    SetTextEntry("STRING")
    AddTextComponentString(str)

    DrawText(x, y)
end

--- Converts degrees to (inter)cardinal directions.
--- @param1 float Degrees. Expects EAST to be 90° and WEST to be 270°.
---               In GTA, WEST is usually 90°, EAST is usually 270°. To convert, subtract that value from 360.
---
--- @return The converted (inter)cardinal direction.
function degreesToIntercardinalDirection(dgr)
    dgr = dgr % 360.0

    if (dgr >= 0.0 and dgr < 22.5) or dgr >= 337.5 then
        return "N "
    elseif dgr >= 22.5 and dgr < 67.5 then
        return "NE"
    elseif dgr >= 67.5 and dgr < 112.5 then
        return "E"
    elseif dgr >= 112.5 and dgr < 157.5 then
        return "SE"
    elseif dgr >= 157.5 and dgr < 202.5 then
        return "S"
    elseif dgr >= 202.5 and dgr < 247.5 then
        return "SW"
    elseif dgr >= 247.5 and dgr < 292.5 then
        return "W"
    elseif dgr >= 292.5 and dgr < 337.5 then
        return "NW"
    end
end
