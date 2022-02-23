fx_version "cerulean"
lua54 "yes"
game "common"

shared_scripts {"config.lua", "shared/table.lua", "shared.lua"}

client_scripts {
    "client/main.lua",
    "client/submix.lua",
    "client/voice.lua",

    "client/module/*.lua",

    "client/commands.lua",
}

server_scripts {"server/main.lua", "server/module/*.lua"}

convar_category "PMA-Voice" {
    "PMA-Voice Configuration Options",
    {
        {"Use 2D audio", "$voice_use2dAudio", "CV_BOOL", "false"},
        {"Use sending range only", "$voice_useSendingRangeOnly", "CV_BOOL", "false"},
        {"Voice radio volume", "$voice_defaultRadioVolume", "CV_STRING", "0.3"},
        {"Voice phone volume", "$voice_defaultPhoneVolume", "CV_STRING", "0.6"},
        {"Enable radios", "$voice_enableRadios", "CV_INT", "1"},
        {"Enable phones", "$voice_enablePhones", "CV_INT", "1"},
        {"Enable radio animation", "$voice_enableRadioAnim", "CV_INT", "0"},
        {"Radio key", "$voice_defaultRadio", "CV_STRING", "LALT"},
        {"Voice debug mode", "$voice_debugMode", "CV_INT", "0"},
    },
}

dependencies {"/onesync", "interact-sound"}
