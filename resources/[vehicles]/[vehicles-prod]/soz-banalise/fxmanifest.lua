fx_version 'cerulean'
game 'gta5'

files {
    "meta/*.meta",
	"audio/*.rel"
}

client_script {
    'vehicle_names.lua'
}

data_file "VEHICLE_METADATA_FILE" "meta/vehicles.meta"
data_file "VEHICLE_VARIATION_FILE" "meta/carvariations.meta"
data_file "AUDIO_GAMEDATA" "audio/emergency_bana_game.dat"
