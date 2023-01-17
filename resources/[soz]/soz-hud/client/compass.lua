local compass = {cardinal = {}, intercardinal = {}}

-- Configuration. Please be careful when editing. It does not check for errors.
compass.position = {x = 0.5, y = 0.07, centered = true}
compass.width = 0.25
compass.fov = 180
compass.followGameplayCam = true

compass.ticksBetweenCardinals = 9.0
compass.tickColour = {r = 255, g = 255, b = 255, a = 255}
compass.tickSize = {w = 0.001, h = 0.003}

compass.cardinal.textSize = 0.25
compass.cardinal.textOffset = 0.015
compass.cardinal.textColour = {r = 255, g = 255, b = 255, a = 255}

compass.cardinal.tickShow = true
compass.cardinal.tickSize = {w = 0.001, h = 0.012}
compass.cardinal.tickColour = {r = 255, g = 255, b = 255, a = 255}

compass.intercardinal.show = true
compass.intercardinal.textShow = true
compass.intercardinal.textSize = 0.2
compass.intercardinal.textOffset = 0.015
compass.intercardinal.textColour = {r = 255, g = 255, b = 255, a = 255}

compass.intercardinal.tickShow = true
compass.intercardinal.tickSize = {w = 0.001, h = 0.006}
compass.intercardinal.tickColour = {r = 255, g = 255, b = 255, a = 255}
-- End of configuration

Citizen.CreateThread(function()
    if compass.position.centered then
        compass.position.x = compass.position.x - compass.width / 2
    end

    while true do
        if PlayerHaveCompass and HudDisplayed and PlayerInVehicle then
            local pxDegree = compass.width / compass.fov
            local playerHeadingDegrees = 0

            if compass.followGameplayCam then
                -- Converts [-180, 180] to [0, 360] where E = 90 and W = 270
                local camRot = Citizen.InvokeNative(0x837765A25378F0BB, 0, Citizen.ResultAsVector())
                playerHeadingDegrees = 360.0 - ((camRot.z + 360.0) % 360.0)
            else
                -- Converts E = 270 to E = 90
                playerHeadingDegrees = 360.0 - GetEntityHeading(PlayerPedId())
            end

            local tickDegree = playerHeadingDegrees - compass.fov / 2
            local tickDegreeRemainder = compass.ticksBetweenCardinals - (tickDegree % compass.ticksBetweenCardinals)
            local tickPosition = compass.position.x + tickDegreeRemainder * pxDegree

            tickDegree = tickDegree + tickDegreeRemainder

            while tickPosition < compass.position.x + compass.width do
                if (tickDegree % 90.0) == 0 then
                    -- Draw cardinal
                    if compass.cardinal.tickShow then
                        DrawRect(tickPosition, compass.position.y, compass.cardinal.tickSize.w, compass.cardinal.tickSize.h, compass.cardinal.tickColour.r,
                                 compass.cardinal.tickColour.g, compass.cardinal.tickColour.b, compass.cardinal.tickColour.a)
                    end

                    drawText(degreesToIntercardinalDirection(tickDegree), tickPosition, compass.position.y + compass.cardinal.textOffset,
                             {
                        size = compass.cardinal.textSize,
                        colour = compass.cardinal.textColour,
                        outline = true,
                        centered = true,
                    })
                elseif (tickDegree % 45.0) == 0 and compass.intercardinal.show then
                    -- Draw intercardinal
                    if compass.intercardinal.tickShow then
                        DrawRect(tickPosition, compass.position.y, compass.intercardinal.tickSize.w, compass.intercardinal.tickSize.h,
                                 compass.intercardinal.tickColour.r, compass.intercardinal.tickColour.g, compass.intercardinal.tickColour.b,
                                 compass.intercardinal.tickColour.a)
                    end

                    if compass.intercardinal.textShow then
                        drawText(degreesToIntercardinalDirection(tickDegree), tickPosition, compass.position.y + compass.intercardinal.textOffset,
                                 {
                            size = compass.intercardinal.textSize,
                            colour = compass.intercardinal.textColour,
                            outline = true,
                            centered = true,
                        })
                    end
                else
                    -- Draw tick
                    DrawRect(tickPosition, compass.position.y, compass.tickSize.w, compass.tickSize.h, compass.tickColour.r, compass.tickColour.g,
                             compass.tickColour.b, compass.tickColour.a)
                end

                -- Advance to the next tick
                tickDegree = tickDegree + compass.ticksBetweenCardinals
                tickPosition = tickPosition + pxDegree * compass.ticksBetweenCardinals
            end
        else
            Wait(500)
        end

        Wait(1)
    end
end)
