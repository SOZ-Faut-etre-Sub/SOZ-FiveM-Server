function ApplyMod(categoryID, modID)
    local plyVeh = Config.AttachedVehicle

    OriginalCategory = categoryID
    OriginalMod = modID

    if categoryID == 48 then
        SetVehicleLivery(plyVeh, modID)
    end
    SetVehicleMod(plyVeh, categoryID, modID)
    exports["soz-bennys"]:setModified(true)
end

function ApplyExtra(extraID)
    local plyVeh = Config.AttachedVehicle
    local isEnabled = IsVehicleExtraTurnedOn(plyVeh, extraID)
    if isEnabled == 1 then
        SetVehicleExtra(plyVeh, tonumber(extraID), 1)
        SetVehiclePetrolTankHealth(plyVeh, 4000.0)
    else
        SetVehicleExtra(plyVeh, tonumber(extraID), 0)
        SetVehiclePetrolTankHealth(plyVeh, 4000.0)
    end
    exports["soz-bennys"]:setModified(true)
end

function ApplyWindowTint(windowTintID)
    local plyVeh = Config.AttachedVehicle
    OriginalWindowTint = windowTintID
    SetVehicleWindowTint(plyVeh, windowTintID)
    exports["soz-bennys"]:setModified(true)
end

function ApplyColour(paintType, paintCategory, paintID)
    local plyVeh = Config.AttachedVehicle
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
    exports["soz-bennys"]:setModified(true)
end

function ApplyWheel(categoryID, wheelID, wheelType)
    local plyVeh = Config.AttachedVehicle
    local doesHaveCustomWheels = GetVehicleModVariation(plyVeh, 23)

    OriginalWheelCategory = categoryID
    OriginalWheel = wheelID
    OriginalWheelType = wheelType

    SetVehicleWheelType(plyVeh, wheelType)
    SetVehicleMod(plyVeh, categoryID, wheelID, doesHaveCustomWheels)

    if GetVehicleClass(plyVeh) == 8 then -- Motorcycle
        SetVehicleMod(plyVeh, 24, wheelID, doesHaveCustomWheels)
    end
    exports["soz-bennys"]:setModified(true)
end

function ApplyCustomWheel(state)
    local plyVeh = Config.AttachedVehicle

    SetVehicleMod(plyVeh, 23, GetVehicleMod(plyVeh, 23), state)

    if GetVehicleClass(plyVeh) == 8 then -- Motorcycle
        SetVehicleMod(plyVeh, 24, GetVehicleMod(plyVeh, 24), state)
    end
    exports["soz-bennys"]:setModified(true)
end

function ApplyNeon(side, enabled)
    local plyVeh = Config.AttachedVehicle

    OriginalNeonLightState = enabled
    OriginalNeonLightSide = side

    SetVehicleNeonLightEnabled(plyVeh, side, enabled)
    exports["soz-bennys"]:setModified(true)
end

function ApplyNeonColour(r, g, b)
    local plyVeh = Config.AttachedVehicle

    OriginalNeonColourR = r
    OriginalNeonColourG = g
    OriginalNeonColourB = b

    SetVehicleNeonLightsColour(plyVeh, r, g, b)
    exports["soz-bennys"]:setModified(true)
end

function ApplyXenonLights(category, state)
    local plyVeh = Config.AttachedVehicle
    ToggleVehicleMod(plyVeh, category, state)
    exports["soz-bennys"]:setModified(true)
end

function ApplyOldLivery(liv)
    local plyVeh = Config.AttachedVehicle

    OriginalOldLivery = liv

    SetVehicleLivery(plyVeh, liv)
    exports["soz-bennys"]:setModified(true)
end

function ApplyPlateIndex(index)
    local plyVeh = Config.AttachedVehicle

    OriginalPlateIndex = index

    SetVehicleNumberPlateTextIndex(plyVeh, index)
    exports["soz-bennys"]:setModified(true)
end

function ApplyTyreSmoke(r, g, b)
    local plyVeh = Config.AttachedVehicle

    ToggleVehicleMod(plyVeh, 20, true)
    SetVehicleTyreSmokeColor(plyVeh, r, g, b)
    exports["soz-bennys"]:setModified(true)
end
