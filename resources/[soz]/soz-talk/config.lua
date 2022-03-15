Config = {}

Config.Radio = {min = 1000, max = 9999}

Config.AllowedRadioInVehicle = {
    [GetHashKey("stockade")] = true,
    [GetHashKey("ambulance")] = true,
    [GetHashKey("fbi")] = true,
    [GetHashKey("fbi2")] = true,
    [GetHashKey("pbus")] = true,
    [GetHashKey("police")] = true,
    [GetHashKey("police2")] = true,
    [GetHashKey("police3")] = true,
    [GetHashKey("policeb")] = true,
    [GetHashKey("policet")] = true,
    [GetHashKey("sheriff")] = true,
    [GetHashKey("sheriff2")] = true,
}

Config.messages = {
    ["not_on_radio"] = "You're not connected to a signal",
    ["on_radio"] = "You're already connected to this signal",
    ["joined_to_radio"] = "You're connected to: ",
    ["restricted_channel_error"] = "You can not connect to this signal!",
    ["invalid_radio"] = "This frequency is not available.",
    ["you_on_radio"] = "You're already connected to this channel",
    ["you_leave"] = "You left the channel.",
    ["volume_radio"] = "New volume ",
    ["decrease_radio_volume"] = "The radio is already set to maximum volume",
    ["increase_radio_volume"] = "The radio is already set to the lowest volume",
    ["increase_decrease_radio_channel"] = "New channel ",
}
