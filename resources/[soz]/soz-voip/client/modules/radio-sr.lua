local IsRadioOn = false
local PrimaryConfiguration, SecondaryConfiguration = {}, {}

--- private functions
local function ConnectToRadio(context, type_, frequency, consumers)
    if context ~= "radio-sr" then
        return
    end

    if RadioFrequencies[frequency] then
        return
    end

    local channel = Frequency:new("radio-sr", frequency)
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
    if context ~= "radio-sr" then
        return
    end

    if not RadioFrequencies[frequency] then
        return
    end

    RadioFrequencies[frequency] = nil
    console.debug("[Radio] Disconnected from %s", frequency)
end

local function AddSubscriber(context, frequency, serverID)
    local channel = RadioFrequencies[frequency]
    if context ~= "radio-sr" then
        return
    end

    if not channel then
        return
    end

    if not channel:consumerExist(serverID) then
        channel:addConsumer(serverID)

        if IsTalkingOnRadio then
            AddPlayerToTargetList(serverID, "radio-sr", true)
        end

        console.debug("[Radio] Subscriber added to %s: %s", frequency, serverID)
    end
end

local function RemoveSubscriber(context, frequency, serverID)
    local channel = RadioFrequencies[frequency]
    if context ~= "radio-sr" then
        return
    end

    if not channel then
        return
    end

    if channel:consumerExist(serverID) then
        channel:removeConsumer(serverID)

        if IsTalkingOnRadio then
            RemovePlayerFromTargetList(serverID, "radio-sr", true, true)
        end

        console.debug("[Radio] Subscriber removed from %s", frequency)
    end
end

local function GetConsumersFromRadio(context, frequency, consumers)
    local channel = RadioFrequencies[frequency]
    if context ~= "radio-sr" then
        return
    end

    if not channel then
        return
    end

    for consumer, _ in pairs(consumers) do
        channel:addConsumer(consumer)
    end
end

local function StartTransmissionPrimary()
    if not IsRadioOn then
        return
    end

    StartTransmission(PrimaryConfiguration.frequency, "radio-sr")
end
local function StopTransmissionPrimary(forced)
    StopTransmission(PrimaryConfiguration.frequency, "radio-sr", forced)
end

local function StartTransmissionSecondary()
    if not IsRadioOn then
        return
    end

    StartTransmission(SecondaryConfiguration.frequency, "radio-sr")
end
local function StopTransmissionSecondary(forced)
    StopTransmission(SecondaryConfiguration.frequency, "radio-sr", forced)
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

function RegisterRadioShortRangeModule()
    console.debug("Registering radio short range module...")

    RegisterModuleContext("radio-sr", 2)
    UpdateContextVolume("radio-sr", 1.0)

    RegisterCommand("+radio_sr_primary", StartTransmissionPrimary, false)
    RegisterCommand("-radio_sr_primary", StopTransmissionPrimary, false)
    RegisterKeyMapping("+radio_sr_primary", "Parler en courte portée (primaire)", "keyboard", Config.radioShortRangePrimaryHotkey)

    RegisterCommand("+radio_sr_secondary", StartTransmissionSecondary, false)
    RegisterCommand("-radio_sr_secondary", StopTransmissionSecondary, false)
    RegisterKeyMapping("+radio_sr_secondary", "Parler en courte portée (secondaire)", "keyboard", Config.radioShortRangeSecondaryHotkey)

    RegisterNetEvent("voip:client:radio:connect", ConnectToRadio)
    RegisterNetEvent("voip:client:radio:disconnect", DisconnectFromRadio)
    RegisterNetEvent("voip:client:radio:getConsumers", GetConsumersFromRadio)

    RegisterNetEvent("voip:client:radio:addConsumer", AddSubscriber)
    RegisterNetEvent("voip:client:radio:removeConsumer", RemoveSubscriber)

    exports("SetRadioShortRangePowerState", SetRadioPowerState)
    exports("SetRadioShortRangePrimaryVolume", SetRadioPrimaryVolume)
    exports("SetRadioShortRangeSecondaryVolume", SetRadioSecondaryVolume)

    console.debug("Radio short range module registered.")
end
