Config = {}

--- Settings
Config.debug = false
Config.filterAllowed = {["call"] = false, ["radio"] = false}

Config.voiceTargets = {[1] = "proximity", [2] = "phone", [3] = "radio", [4] = "speaker", [5] = "car"}

--- Voice Proximity
Config.voiceRanges = {
    [1] = {name = "whisper", range = 1.5},
    [2] = {name = "normal", range = 3.0},
    [3] = {name = "shout", range = 7.0},
}
Config.megaphoneRange = 20.0
Config.microphoneRange = 20.0

--- Radio
Config.radioFrequencies = {min = 10000, max = 99999}
Config.radioShortRangeDistance = 3000.0

--- Volume
Config.volumes = {["call"] = 0.8, ["vehicle"] = 0.5}

-- Grid Module
Config.gridSize = 512
Config.gridEdge = 256

--- Hotkeys
Config.rangeDecreaseHotkey = "F5"
Config.rangeIncreaseHotkey = "F6"
Config.muteHotkey = "F7"
Config.radioShortRangePrimaryHotkey = "COMMA"
Config.radioShortRangeSecondaryHotkey = "SEMICOLON"
Config.radioLongRangePrimaryHotkey = ""
Config.radioLongRangeSecondaryHotkey = ""
