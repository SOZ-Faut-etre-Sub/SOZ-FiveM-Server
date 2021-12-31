local streetName = {}

-- Configuration. Please be careful when editing. It does not check for errors.
streetName.position = {x = 0.5, y = 0.02, centered = true}
streetName.textSize = 0.45
streetName.textColour = {r = 255, g = 255, b = 255, a = 255}
-- End of configuration

Citizen.CreateThread( function()
    local lastStreetA = 0
    local lastStreetB = 0

    while true do
        if HudDisplayed then
            local playerPos = GetEntityCoords( GetPlayerPed( -1 ), true )
            local streetA, streetB = GetStreetNameAtCoord(playerPos.x, playerPos.y, playerPos.z)
            local street = {}

            if not ((streetA == lastStreetA or streetA == lastStreetB) and (streetB == lastStreetA or streetB == lastStreetB)) then
                -- Ignores the switcharoo while doing circles on intersections
                lastStreetA = streetA
                lastStreetB = streetB
            end

            if lastStreetA ~= 0 then
                table.insert( street, GetStreetNameFromHashKey( lastStreetA ) )
            end

            if lastStreetB ~= 0 then
                table.insert( street, GetStreetNameFromHashKey( lastStreetB ) )
            end

            drawText( table.concat( street, " & " ), streetName.position.x, streetName.position.y, {
                size = streetName.textSize,
                font = 1,
                colour = streetName.textColour,
                outline = true,
                centered = streetName.position.centered
            })

            Wait( 5 )
        else
            Wait(500)
        end
    end
end)
