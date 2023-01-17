local streetName = {}

-- Configuration. Please be careful when editing. It does not check for errors.
streetName.position = {x = 0.5, y = 0.02, centered = true}
streetName.textSize = 0.45
streetName.textColour = {r = 255, g = 255, b = 255, a = 255}
-- End of configuration

local street = {}

Citizen.CreateThread(function()
    local lastStreetA = 0
    local lastStreetB = 0

    while true do
        if HudDisplayed then
            local playerPos = GetEntityCoords(PlayerPedId(), true)
            local streetA, streetB = GetStreetNameAtCoord(playerPos.x, playerPos.y, playerPos.z)
            street = {}

            if not ((streetA == lastStreetA or streetA == lastStreetB) and (streetB == lastStreetA or streetB == lastStreetB)) then
                lastStreetA = streetA
                lastStreetB = streetB
            end

            if lastStreetA ~= 0 then
                table.insert(street, GetStreetNameFromHashKey(lastStreetA))
            end

            if lastStreetB ~= 0 then
                table.insert(street, GetStreetNameFromHashKey(lastStreetB))
            end

            Wait(1000)
        else
            Wait(5000)
        end
    end
end)

Citizen.CreateThread(function()
    while true do
        if PlayerHaveCompass and HudDisplayed and PlayerInVehicle then
            drawText(table.concat(street, " & "), streetName.position.x, streetName.position.y, {
                size = streetName.textSize,
                font = 1,
                colour = streetName.textColour,
                outline = true,
                centered = streetName.position.centered,
            })

            Wait(1)
        else
            Wait(1000)
        end
    end
end)
