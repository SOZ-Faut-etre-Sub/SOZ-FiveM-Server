fx_version "cerulean"
game "gta5"

file "sp_manifest.ymt"
data_file "SCENARIO_POINTS_OVERRIDE_PSO_FILE" "sp_manifest.ymt"


files {
	'events.meta',
	'relationships.dat'
}

data_file 'FIVEM_LOVES_YOU_4B38E96CC036038F' 'events.meta'


server_script 'server.lua'
client_script 'client.lua'

