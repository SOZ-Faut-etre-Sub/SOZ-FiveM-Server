function GetCurrentMod(id)
    local plyVeh = Config.AttachedVehicle
    local mod = GetVehicleMod(plyVeh, id)
    local modName = GetLabelText(GetModTextLabel(plyVeh, id, mod))

    return mod, modName
end

function GetCurrentWheel()
    local plyVeh = Config.AttachedVehicle
    local wheel = GetVehicleMod(plyVeh, 23)
    local wheelName = GetLabelText(GetModTextLabel(plyVeh, 23, wheel))
    local wheelType = GetVehicleWheelType(plyVeh)

    return wheel, wheelName, wheelType
end

function GetCurrentCustomWheelState()
    local plyVeh = Config.AttachedVehicle
    local state = GetVehicleModVariation(plyVeh, 23)

    if state then
        return 1
    else
        return 0
    end
end

function GetOriginalWheel()
    return originalWheel
end

function GetOriginalCustomWheel()
    return originalCustomWheels
end

function GetCurrentWindowTint()
    local plyVeh = Config.AttachedVehicle
    local tint = GetVehicleWindowTint(plyVeh)
    if tint == -1 then
        tint = 0
    end
    return tint
end

function GetCurrentVehicleWheelSmokeColour()
    local plyVeh = Config.AttachedVehicle
    local r, g, b = GetVehicleTyreSmokeColor(plyVeh)

    return r, g, b
end

function GetCurrentNeonState(id)
    local plyVeh = Config.AttachedVehicle
    local isEnabled = IsVehicleNeonLightEnabled(plyVeh, id)

    if isEnabled then
        return 1
    else
        return 0
    end
end

function GetCurrentNeonColour()
    local plyVeh = Config.AttachedVehicle
    local r, g, b = GetVehicleNeonLightsColour(plyVeh)

    return r, g, b
end

function GetCurrentXenonState()
    local plyVeh = Config.AttachedVehicle
    local isEnabled = IsToggleModOn(plyVeh, 22)

    if isEnabled then
        return 1
    else
        return 0
    end
end

function GetCurrentExtraState(extra)
    local plyVeh = Config.AttachedVehicle
    return IsVehicleExtraTurnedOn(plyVeh, extra)
end

function CheckValidMods(category, id, wheelType)
    local plyVeh = Config.AttachedVehicle
    local tempMod = GetVehicleMod(plyVeh, id)
    local tempWheel = GetVehicleMod(plyVeh, 23)
    local tempWheelType = GetVehicleWheelType(plyVeh)
    local tempWheelCustom = GetVehicleModVariation(plyVeh, 23)
    local validMods = {}
    local amountValidMods = 0
    local hornNames = {}

    if wheelType ~= nil then
        SetVehicleWheelType(plyVeh, wheelType)
    end

    if id == 14 then
        for k, v in pairs(Config.vehicleCustomisationMechanic) do
            if Config.vehicleCustomisationMechanic[k].category == category then
                hornNames = Config.vehicleCustomisationMechanic[k].hornNames

                break
            end
        end
    end

    local modAmount = GetNumVehicleMods(plyVeh, id)
    for i = 1, modAmount do
        local label = GetModTextLabel(plyVeh, id, (i - 1))
        local modName = GetLabelText(label)

        if modName == "NULL" then
            if id == 14 then
                if i <= #hornNames then
                    modName = hornNames[i].name
                else
                    modName = "Horn " .. i
                end
            else
                modName = category .. " " .. i
            end
        end

        local isbanned
        for x, y in pairs(Config.vehicleCustomisationBannedMods) do
            if Config.vehicleCustomisationBannedMods[x] == modName then
                isbanned = true
            end
        end

        if not isbanned then
            validMods[i] = {id = (i - 1), name = modName}

            amountValidMods = amountValidMods + 1
        end
    end

    if modAmount > 0 then
        table.insert(validMods, 1, {id = -1, name = "Stock " .. category})
    end

    if wheelType ~= nil then
        SetVehicleWheelType(plyVeh, tempWheelType)
        SetVehicleMod(plyVeh, 23, tempWheel, tempWheelCustom)
    end

    return validMods, amountValidMods
end
