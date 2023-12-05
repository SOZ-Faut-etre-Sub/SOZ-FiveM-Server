Config = {}

--- Settings
Config.debug = false

--- Voice Proximity
Config.whisperRange = 2.0
Config.normalRange = 4.5
Config.shoutRange = 8.0
Config.megaphoneRange = 38.0
Config.microphoneRange = 38.0

Config.voiceRanges = {
    [1] = {name = "whisper", range = Config.whisperRange},
    [2] = {name = "normal", range = Config.normalRange},
    [3] = {name = "shout", range = Config.shoutRange},
}

--- Radio
Config.radioFrequencies = {min = 10000, max = 99999}
Config.radioShortRangeDistance = 3000.0

--- Balance
Config.balanceRadioPrimaryShort = "center"
Config.balanceRadioPrimaryLong = "center"
Config.balanceRadioSecondaryShort = "center"
Config.balanceRadioSecondaryLong = "center"

Config.balances = {
    ["center"] = {left = 1.0, right = 1.0},
    ["left"] = {left = 1.0, right = 0.0},
    ["right"] = {left = 0.0, right = 1.0},
}

--- Volume
Config.volumeRadioSoundClick = 0.4
Config.volumeRadioPrimaryShort = 1.0
Config.volumeRadioPrimaryLong = 1.0
Config.volumeRadioSecondaryShort = 1.0
Config.volumeRadioSecondaryLong = 1.0
Config.volumeCall = 0.8
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
