Config = {}

--- Settings
Config.debug = false

--- Voice Proximity
Config.whisperRange = 1.5
Config.normalRange = 3.0
Config.shoutRange = 7.0
Config.megaphoneRange = 20.0
Config.microphoneRange = 20.0

Config.voiceRanges = {
    [1] = {name = "whisper", range = Config.whisperRange},
    [2] = {name = "normal", range = Config.normalRange},
    [3] = {name = "shout", range = Config.shoutRange},
}

--- Radio
Config.radioFrequencies = {min = 10000, max = 99999}
Config.radioShortRangeDistance = 3000.0

--- Volume
Config.volumeRadioPrimaryShort = 0.8
Config.volumeRadioPrimaryLong = 0.8
Config.volumeRadioSecondaryShort = 0.8
Config.volumeRadioSecondaryLong = 0.8
Config.volumeCall = 0.6
Config.volumeVehicle = 0.5

--- Grid Module
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
