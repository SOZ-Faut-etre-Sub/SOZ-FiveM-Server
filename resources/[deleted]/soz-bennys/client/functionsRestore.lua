function RestoreOriginalMod()
    if OriginalCategory ~= nil and OriginalMod ~= nil then
        local plyVeh = Config.AttachedVehicle

        SetVehicleMod(plyVeh, OriginalCategory, OriginalMod)
        SetVehicleDoorsShut(plyVeh, true)

        OriginalCategory = nil
        OriginalMod = nil
    end
end

function RestoreOriginalWindowTint()
    if OriginalWindowTint ~= nil then
        local plyVeh = Config.AttachedVehicle

        SetVehicleWindowTint(plyVeh, OriginalWindowTint)

        OriginalWindowTint = nil
    end
end

function RestoreOriginalColours()
    if OriginalDashColour ~= nil and OriginalInterColour ~= nil and OriginalPrimaryColour ~= nil and OriginalSecondaryColour ~= nil and
        OriginalPearlescentColour ~= nil and OriginalWheelColour ~= nil then
        local plyVeh = Config.AttachedVehicle

        SetVehicleColours(plyVeh, OriginalPrimaryColour, OriginalSecondaryColour)
        SetVehicleExtraColours(plyVeh, OriginalPearlescentColour, OriginalWheelColour)
        SetVehicleDashboardColour(plyVeh, OriginalDashColour)
        SetVehicleInteriorColour(plyVeh, OriginalInterColour)

        OriginalPrimaryColour = nil
        OriginalSecondaryColour = nil
        OriginalPearlescentColour = nil
        OriginalWheelColour = nil
        OriginalDashColour = nil
        OriginalInterColour = nil
    end
end

function RestoreOriginalWheels()
    if OriginalWheelCategory ~= nil and OriginalWheel ~= nil and OriginalWheelType ~= nil and OriginalCustomWheels ~= nil then
        local plyVeh = Config.AttachedVehicle
        local doesHaveCustomWheels = GetVehicleModVariation(plyVeh, 23)

        SetVehicleWheelType(plyVeh, OriginalWheelType)

        if OriginalWheelCategory ~= nil then
            SetVehicleMod(plyVeh, OriginalWheelCategory, OriginalWheel, OriginalCustomWheels)

            if GetVehicleClass(plyVeh) == 8 then -- Motorcycle
                SetVehicleMod(plyVeh, 24, OriginalWheel, OriginalCustomWheels)
            end

            OriginalWheelType = nil
            OriginalWheelCategory = nil
            OriginalWheel = nil
            OriginalCustomWheels = nil
        end
    end
end

function RestoreOriginalNeonStates()
    if OriginalNeonLightSide ~= nil and OriginalNeonLightState ~= nil then
        local plyVeh = Config.AttachedVehicle

        SetVehicleNeonLightEnabled(plyVeh, OriginalNeonLightSide, OriginalNeonLightState)

        OriginalNeonLightState = nil
        OriginalNeonLightSide = nil
    end
end

function RestoreOriginalNeonColours()
    if OriginalNeonColourR ~= nil and OriginalNeonColourG ~= nil and OriginalNeonColourB ~= nil then
        local plyVeh = Config.AttachedVehicle

        SetVehicleNeonLightsColour(plyVeh, OriginalNeonColourR, OriginalNeonColourG, OriginalNeonColourB)

        OriginalNeonColourR = nil
        OriginalNeonColourG = nil
        OriginalNeonColourB = nil
    end
end

function RestoreOldLivery()
    if OriginalOldLivery ~= nil then
        local plyVeh = Config.AttachedVehicle
        SetVehicleLivery(plyVeh, OriginalOldLivery)
    end
end

function RestorePlateIndex()
    if OriginalPlateIndex ~= nil then
        local plyVeh = Config.AttachedVehicle
        SetVehicleNumberPlateTextIndex(plyVeh, OriginalPlateIndex)
    end
end
