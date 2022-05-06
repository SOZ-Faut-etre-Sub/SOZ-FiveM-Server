fx_version 'cerulean'
game 'gta5'

files {
    "meta/**/*.meta",
    "audio/*.rel"
}

client_script {
    'vehicle_names.lua'
}

data_file "HANDLING_FILE" "meta/**/handling.meta"
data_file "VEHICLE_METADATA_FILE" "meta/**/vehicles.meta"
data_file "VEHICLE_VARIATION_FILE" "meta/**/carvariations.meta"
data_file "AUDIO_GAMEDATA" "audio/cogfbi_game.dat"
data_file "CARCOLS_FILE" "meta/**/carcols.meta"
data_file "VEHICLE_LAYOUTS_FILE" "meta/**/vehiclelayouts.meta"
