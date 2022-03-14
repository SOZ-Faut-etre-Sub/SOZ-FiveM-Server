function ApplyMod(categoryID, modID)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    OriginalCategory = categoryID
    OriginalMod = modID

    SetVehicleMod(plyVeh, categoryID, modID)
end

function ApplyExtra(extraID)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)
    local isEnabled = IsVehicleExtraTurnedOn(plyVeh, extraID)
    if isEnabled == 1 then
        SetVehicleExtra(plyVeh, tonumber(extraID), 1)
        SetVehiclePetrolTankHealth(plyVeh, 4000.0)
    else
        SetVehicleExtra(plyVeh, tonumber(extraID), 0)
        SetVehiclePetrolTankHealth(plyVeh, 4000.0)
    end
end

function ApplyWindowTint(windowTintID)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)
    OriginalWindowTint = windowTintID
    SetVehicleWindowTint(plyVeh, windowTintID)
end

function ApplyColour(paintType, paintCategory, paintID)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)
    local vehPrimaryColour, vehSecondaryColour = GetVehicleColours(plyVeh)
    local vehPearlescentColour, vehWheelColour = GetVehicleExtraColours(plyVeh)

    if paintType == 0 then -- Primary Colour
        if paintCategory == 1 then -- Metallic Paint
            SetVehicleColours(plyVeh, paintID, vehSecondaryColour)
            -- SetVehicleExtraColours(plyVeh, paintID, vehWheelColour)
            SetVehicleExtraColours(plyVeh, OriginalPearlescentColour, vehWheelColour)
            OriginalPrimaryColour = paintID
            -- OriginalPearlescentColour = paintID
        else
            SetVehicleColours(plyVeh, paintID, vehSecondaryColour)
            OriginalPrimaryColour = paintID
        end
    elseif paintType == 1 then -- Secondary Colour
        SetVehicleColours(plyVeh, vehPrimaryColour, paintID)
        OriginalSecondaryColour = paintID
    elseif paintType == 2 then -- Pearlescent Colour
        SetVehicleExtraColours(plyVeh, paintID, vehWheelColour)
        OriginalPearlescentColour = paintID
    elseif paintType == 3 then -- Wheel Colour
        SetVehicleExtraColours(plyVeh, vehPearlescentColour, paintID)
        OriginalWheelColour = paintID
    elseif paintType == 4 then -- Dash Colour
        SetVehicleDashboardColour(plyVeh, paintID)
        OriginalDashColour = paintID
    elseif paintType == 5 then -- Interior Colour
        SetVehicleInteriorColour(plyVeh, paintID)
        OriginalInterColour = paintID
    end
end

function ApplyWheel(categoryID, wheelID, wheelType)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)
    local doesHaveCustomWheels = GetVehicleModVariation(plyVeh, 23)

    OriginalWheelCategory = categoryID
    OriginalWheel = wheelID
    OriginalWheelType = wheelType

    SetVehicleWheelType(plyVeh, wheelType)
    SetVehicleMod(plyVeh, categoryID, wheelID, doesHaveCustomWheels)

    if GetVehicleClass(plyVeh) == 8 then -- Motorcycle
        SetVehicleMod(plyVeh, 24, wheelID, doesHaveCustomWheels)
    end
end

function ApplyCustomWheel(state)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    SetVehicleMod(plyVeh, 23, GetVehicleMod(plyVeh, 23), state)

    if GetVehicleClass(plyVeh) == 8 then -- Motorcycle
        SetVehicleMod(plyVeh, 24, GetVehicleMod(plyVeh, 24), state)
    end
end

function ApplyNeon(side, enabled)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    OriginalNeonLightState = enabled
    OriginalNeonLightSide = side

    SetVehicleNeonLightEnabled(plyVeh, side, enabled)
end

function ApplyNeonColour(r, g, b)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    OriginalNeonColourR = r
    OriginalNeonColourG = g
    OriginalNeonColourB = b

    SetVehicleNeonLightsColour(plyVeh, r, g, b)
end

function ApplyXenonLights(category, state)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)
    ToggleVehicleMod(plyVeh, category, state)
end

function ApplyXenonColour(colour)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    OriginalXenonColour = colour

    SetVehicleHeadlightsColour(plyVeh, colour)
end

function ApplyOldLivery(liv)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    OriginalOldLivery = liv

    SetVehicleLivery(plyVeh, liv)
end

function ApplyPlateIndex(index)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    OriginalPlateIndex = index

    SetVehicleNumberPlateTextIndex(plyVeh, index)
end

function ApplyTyreSmoke(r, g, b)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    ToggleVehicleMod(plyVeh, 20, true)
    SetVehicleTyreSmokeColor(plyVeh, r, g, b)
end
