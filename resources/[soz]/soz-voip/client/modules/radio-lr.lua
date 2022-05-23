local IsRadioOn = false
local PrimaryConfiguration, SecondaryConfiguration = {}, {}

--- private functions
local function ConnectToRadio(context, type_, frequency, consumers)
    if context ~= "radio-lr" then
        return
    end

    if RadioFrequencies[frequency] and RadioFrequencies[frequency].module == "radio-lr" then
        return
    end

    if RadioFrequencies[frequency] and RadioFrequencies[frequency].module == "radio-sr" then
        RadioFrequencies[frequency]:setAvailableOnLongRange(true)
        console.debug("[Radio] %s is available on long range", frequency)

        return
    end

    local channel = Frequency:new("radio-lr", frequency)
    for consumer, _ in pairs(consumers) do
        channel:addConsumer(consumer)
    end

    if type_ == "primary" then
        PrimaryConfiguration.frequency = frequency
    elseif type_ == "secondary" then
        SecondaryConfiguration.frequency = frequency
    end

    RadioFrequencies[frequency] = channel
    console.debug("[Radio] Connected to %s", frequency)
end

local function DisconnectFromRadio(context, frequency)
    if context ~= "radio-lr" then
        return
    end

    if not RadioFrequencies[frequency] then
        return
    end

    if RadioFrequencies[frequency].module == "radio-sr" and RadioFrequencies[frequency]:isAvailableOnLongRange() then
        RadioFrequencies[frequency]:setAvailableOnLongRange(false)
        console.debug("[Radio] %s is not available on long range", frequency)

        return
    end

    RadioFrequencies[frequency] = nil
    console.debug("[Radio] Disconnected from %s", frequency)
end

local function AddSubscriber(context, frequency, serverID)
    local channel = RadioFrequencies[frequency]
    if context ~= "radio-lr" then
        return
    end

    if not channel then
        return
    end

    if not channel:consumerExist(serverID) then
        channel:addConsumer(serverID)

        if IsTalkingOnRadio then
            AddPlayerToTargetList(serverID, "radio-lr", true)
        end

        console.debug("[Radio] Subscriber added to %s: %s", frequency, serverID)
    end
end

local function RemoveSubscriber(context, frequency, serverID)
    local channel = RadioFrequencies[frequency]
    if context ~= "radio-lr" then
        return
    end

    if not channel then
        return
    end

    if channel:consumerExist(serverID) then
        channel:removeConsumer(serverID)

        if IsTalkingOnRadio then
            RemovePlayerFromTargetList(serverID, "radio-lr", true, true)
        end

        console.debug("[Radio] Subscriber removed from %s", frequency)
    end
end

local function StartTransmissionPrimary()
    if not IsRadioOn then
        return
    end

    console.debug("[Radio] Start transmission primary")

    StartTransmission(PrimaryConfiguration.frequency, "radio-lr")
end
local function StopTransmissionPrimary(forced)
    StopTransmission(PrimaryConfiguration.frequency, "radio-lr", forced)
end

local function StartTransmissionSecondary()
    if not IsRadioOn then
        return
    end

    StartTransmission(SecondaryConfiguration.frequency, "radio-lr")
end
local function StopTransmissionSecondary(forced)
    StopTransmission(SecondaryConfiguration.frequency, "radio-lr", forced)
end

local function SetRadioPowerState(state)
    IsRadioOn = state

    if not IsRadioOn then
        StopTransmissionPrimary(true)
        StopTransmissionSecondary(true)
    end
end

local function SetRadioPrimaryVolume(volume)
    if not IsRadioOn then
        return
    end

    if not RadioFrequencies[PrimaryConfiguration.frequency] then
        return
    end

    RadioFrequencies[PrimaryConfiguration.frequency]:setVolume(volume / 100)
end

local function SetRadioSecondaryVolume(volume)
    if not IsRadioOn then
        return
    end

    if not RadioFrequencies[SecondaryConfiguration.frequency] then
        return
    end

    RadioFrequencies[SecondaryConfiguration.frequency]:setVolume(volume / 100)
end

function RegisterRadioLongRangeModule()
    console.debug("Registering radio long range module...")

    RegisterModuleContext("radio-lr", 3)
    UpdateContextVolume("radio-lr", 1.0)

    RegisterCommand("+radio_lr_primary", StartTransmissionPrimary, false)
    RegisterCommand("-radio_lr_primary", StopTransmissionPrimary, false)
    RegisterKeyMapping("+radio_lr_primary", "Parler en longue portée (primaire)", "keyboard", Config.radioLongRangePrimaryHotkey)

    RegisterCommand("+radio_lr_secondary", StartTransmissionSecondary, false)
    RegisterCommand("-radio_lr_secondary", StopTransmissionSecondary, false)
    RegisterKeyMapping("+radio_lr_secondary", "Parler en longue portée (secondaire)", "keyboard", Config.radioLongRangeSecondaryHotkey)

    RegisterNetEvent("voip:client:radio:connect", ConnectToRadio)
    RegisterNetEvent("voip:client:radio:disconnect", DisconnectFromRadio)

    RegisterNetEvent("voip:client:radio:addConsumer", AddSubscriber)
    RegisterNetEvent("voip:client:radio:removeConsumer", RemoveSubscriber)

    exports("SetRadioLongRangePowerState", SetRadioPowerState)
    exports("SetRadioLongRangePrimaryVolume", SetRadioPrimaryVolume)
    exports("SetRadioLongRangeSecondaryVolume", SetRadioSecondaryVolume)

    console.debug("Radio long range module registered.")
end
