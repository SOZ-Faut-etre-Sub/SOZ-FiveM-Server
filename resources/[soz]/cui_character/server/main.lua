QBCore = exports['qb-core']:GetCoreObject()

-- Money Stuff

QBCore.Functions.CreateCallback('cui_character:checkMoney', function(source, cb, amount)
    local _source = source
    local Player = QBCore.Functions.GetPlayer(_source)
    local cashamount = Player.Functions.GetMoney('cash')

    if cashamount >= amount then
        cb(true)
        Player.Functions.RemoveMoney('cash', amount)
        TriggerClientEvent('QBCore:Notify', _source, 'Paid $' ..amount, 'success')
    else
        cb(false)
        TriggerClientEvent('QBCore:Notify', _source, 'Not Enough Money', 'error')
    end
end)

-- Save Skin

RegisterNetEvent('cui_character:save', function(model, data)
    local _source = source
    local Player = QBCore.Functions.GetPlayer(_source)
    local citizenid = Player.PlayerData.citizenid

    if citizenid then
        exports.oxmysql:execute('SELECT `skin` FROM `playerskins` WHERE `citizenid` = "'..citizenid..'"', function(result)
            if result[1] then
                exports.oxmysql:execute('UPDATE `playerskins` SET `skin` = @skin WHERE `citizenid` = "'..citizenid..'"', {['@skin'] = json.encode(data)})
            else
                exports.oxmysql:execute('INSERT INTO `playerskins` (`citizenid`, `skin`, `model`, `active`) VALUES (@citizenid, @skin, @model, @active)', {
                    ['@citizenid'] = citizenid,
                    ['@skin'] = json.encode(data),
                    ['@model'] = model,
                    ['@active'] = 1
                })
            end
        end)
    end
end)

-- Get Skin

RegisterNetEvent('cui_character:requestPlayerData', function()
    	local _source= source
	local Player = QBCore.Functions.GetPlayer(_source)   
    	local citizenid = Player.PlayerData.citizenid

    	if citizenid then
        	exports.oxmysql:execute('SELECT skin FROM playerskins WHERE citizenid = @citizenid', {
            	['@citizenid'] = citizenid
        	}, function(users)
            	local playerData = { skin = nil, newPlayer = true}
            	if users and users[1] ~= nil and users[1].skin ~= nil then
                	playerData.skin = json.decode(users[1].skin)
                	playerData.newPlayer = false
            	end
            	TriggerClientEvent('cui_character:recievePlayerData', _source, playerData)
        	end)
    	end
end)
