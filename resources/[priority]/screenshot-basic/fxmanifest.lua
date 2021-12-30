fx_version 'bodacious'
game 'common'

client_script 'dist/client.js'
server_script 'dist/server.js'

dependency 'yarn'
dependency 'webpack'

webpack_config 'client.config.js'
webpack_config 'server.config.js'
webpack_config 'ui.config.js'

files {
    'dist/ui.html'
}

ui_page 'dist/ui.html'