Config = {}

--- Settings
Config.enableDebug = true

Config.voiceTargets = {
    [1] = "proximity",
    [2] = "phone",
    [3] = "radio",
    [4] = "speaker",
    [5] = "car",
}

--- Voice Proximity
Config.voiceRanges = {
    [1] = {name = "whisper", range = 2.0},
    [2] = {name = "normal", range = 6.0},
    [3] = {name = "shout", range = 12.0},
}

--- Volume
Config.volumes = {
    ["vehicle"] = 0.5,
}

--- Hotkeys
Config.rangeDecreaseHotkey = "F5"
Config.rangeIncreaseHotkey = "F6"
Config.muteHotkey = "F7"
Config.radioShortRangePrimaryHotkey = "COMMA"
Config.radioShortRangeSecondaryHotkey = "SEMICOLON"
Config.radioLongRangePrimaryHotkey = ""
Config.radioLongRangeSecondaryHotkey = ""
