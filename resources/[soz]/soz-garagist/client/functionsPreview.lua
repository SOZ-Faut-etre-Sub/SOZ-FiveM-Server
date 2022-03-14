function PreviewMod(categoryID, modID)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    if OriginalMod == nil and OriginalCategory == nil then
        OriginalCategory = categoryID
        OriginalMod = GetVehicleMod(plyVeh, categoryID)
    end

    if categoryID == 39 or categoryID == 40 or categoryID == 41 then
        SetVehicleDoorOpen(plyVeh, 4, false, true)
    elseif categoryID == 37 or categoryID == 38 then
        SetVehicleDoorOpen(plyVeh, 5, false, true)
    end

    SetVehicleMod(plyVeh, categoryID, modID)
end

function PreviewWindowTint(windowTintID)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    if OriginalWindowTint == nil then
        OriginalWindowTint = GetVehicleWindowTint(plyVeh)
    end

    SetVehicleWindowTint(plyVeh, windowTintID)
end

function PreviewColour(paintType, paintCategory, paintID)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)
    SetVehicleModKit(plyVeh, 0)
    if OriginalDashColour == nil and OriginalInterColour == nil and OriginalPrimaryColour == nil and OriginalSecondaryColour == nil and
        OriginalPearlescentColour == nil and OriginalWheelColour == nil then
        OriginalPrimaryColour, OriginalSecondaryColour = GetVehicleColours(plyVeh)
        OriginalPearlescentColour, OriginalWheelColour = GetVehicleExtraColours(plyVeh)
        OriginalDashColour = GetVehicleDashboardColour(plyVeh)
        OriginalInterColour = GetVehicleInteriorColour(plyVeh)
    end
    if paintType == 0 then -- Primary Colour
        if paintCategory == 1 then -- Metallic Paint
            SetVehicleColours(plyVeh, paintID, OriginalSecondaryColour)
            SetVehicleExtraColours(plyVeh, OriginalPearlescentColour, OriginalWheelColour)
        else
            SetVehicleColours(plyVeh, paintID, OriginalSecondaryColour)
        end
    elseif paintType == 1 then -- Secondary Colour
        SetVehicleColours(plyVeh, OriginalPrimaryColour, paintID)
    elseif paintType == 2 then -- Pearlescent Colour
        SetVehicleExtraColours(plyVeh, paintID, OriginalWheelColour)
    elseif paintType == 3 then -- Wheel Colour
        SetVehicleExtraColours(plyVeh, OriginalPearlescentColour, paintID)
    elseif paintType == 4 then -- Dash Colour
        SetVehicleDashboardColour(plyVeh, paintID)
    elseif paintType == 5 then -- Interior Colour
        SetVehicleInteriorColour(plyVeh, paintID)
    end
end

function PreviewWheel(categoryID, wheelID, wheelType)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)
    local doesHaveCustomWheels = GetVehicleModVariation(plyVeh, 23)

    if OriginalWheelCategory == nil and OriginalWheel == nil and OriginalWheelType == nil and OriginalCustomWheels == nil then
        OriginalWheelCategory = categoryID
        OriginalWheelType = GetVehicleWheelType(plyVeh)
        OriginalWheel = GetVehicleMod(plyVeh, 23)
        OriginalCustomWheels = GetVehicleModVariation(plyVeh, 23)
    end

    SetVehicleWheelType(plyVeh, wheelType)
    SetVehicleMod(plyVeh, categoryID, wheelID, doesHaveCustomWheels)

    if GetVehicleClass(plyVeh) == 8 then -- Motorcycle
        SetVehicleMod(plyVeh, 24, wheelID, doesHaveCustomWheels)
    end
end

function PreviewNeon(side, enabled)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    if OriginalNeonLightState == nil and OriginalNeonLightSide == nil then
        if IsVehicleNeonLightEnabled(plyVeh, side) then
            OriginalNeonLightState = 1
        else
            OriginalNeonLightState = 0
        end

        OriginalNeonLightSide = side
    end

    SetVehicleNeonLightEnabled(plyVeh, side, enabled)
end

function PreviewNeonColour(r, g, b)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    if OriginalNeonColourR == nil and OriginalNeonColourG == nil and OriginalNeonColourB == nil then
        OriginalNeonColourR, OriginalNeonColourG, OriginalNeonColourB = GetVehicleNeonLightsColour(plyVeh)
    end

    SetVehicleNeonLightsColour(plyVeh, r, g, b)
end

function PreviewXenonColour(colour)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)

    if OriginalXenonColour == nil then
        OriginalXenonColour = GetVehicleHeadlightsColour(plyVeh)
    end

    SetVehicleLights(plyVeh, 2)
    SetVehicleHeadlightsColour(plyVeh, colour)
end

function PreviewOldLivery(liv)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)
    if OriginalOldLivery == nil then
        OriginalOldLivery = GetVehicleLivery(plyVeh)
    end

    SetVehicleLivery(plyVeh, tonumber(liv))
end

function PreviewPlateIndex(index)
    local plyPed = PlayerPedId()
    local plyVeh = GetVehiclePedIsIn(plyPed, false)
    if OriginalPlateIndex == nil then
        OriginalPlateIndex = GetVehicleNumberPlateTextIndex(plyVeh)
    end

    SetVehicleNumberPlateTextIndex(plyVeh, tonumber(index))
end
