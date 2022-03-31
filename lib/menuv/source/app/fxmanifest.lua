----------------------- [ MenuV ] -----------------------
-- GitHub: https://github.com/ThymonA/menuv/
-- License: GNU General Public License v3.0
--          https://choosealicense.com/licenses/gpl-3.0/
-- Author: Thymon Arens <contact@arens.io>
-- Name: MenuV
-- Description: FiveM menu library for creating menu's
----------------------- [ MenuV ] -----------------------
fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'MenuV'
description 'FiveM menu library for creating menu\'s'
author 'ThymonA'
contact 'contact@arens.io'
url 'https://github.com/ThymonA/menuv/'

files {
    'menuv.lua',
    'menuv/components/*.lua',
    'dist/*.html',
    'dist/assets/**/*',
    'languages/*.json'
}

ui_page 'dist/menuv.html'

client_scripts {
    'config.lua',
    'menuv/components/utilities.lua',
    'menuv/menuv.lua'
}
