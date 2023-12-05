
------
-- InteractionSound by Scott
-- Version: v0.0.1
-- Path: client/main.lua
--
-- Allows sounds to be played on single clients, all clients, or all clients within
-- a specific range from the entity to which the sound has been created.
------

local standardVolumeOutput = 0.3;
local hasPlayerLoaded = false
Citizen.CreateThread(function()
	Wait(5000)
	hasPlayerLoaded = true
    TriggerServerEvent('soz-core:server:sound:init')
end)
------
-- RegisterNetEvent LIFE_CL:Sound:PlayOnOne
--
-- @param soundFile    - The name of the soundfile within the client/html/sounds/ folder.
--                     - Can also specify a folder/sound file.
-- @param soundVolume  - The volume at which the soundFile should be played. Nil or don't
--                     - provide it for the default of standardVolumeOutput. Should be between
--                     - 0.1 to 1.0.
--
-- Starts playing a sound locally on a single client.
------
RegisterNetEvent('InteractSound_CL:PlayOnOne')
AddEventHandler('InteractSound_CL:PlayOnOne', function(soundFile, soundVolume)
    if hasPlayerLoaded then
        SendNUIMessage({
            transactionType = 'playSound',
            transactionFile  = soundFile,
            transactionVolume = soundVolume
        })
    end
end)

------
-- RegisterNetEvent LIFE_CL:Sound:PlayOnAll
--
-- @param soundFile    - The name of the soundfile within the client/html/sounds/ folder.
--                     - Can also specify a folder/sound file.
-- @param soundVolume  - The volume at which the soundFile should be played. Nil or don't
--                     - provide it for the default of standardVolumeOutput. Should be between
--                     - 0.1 to 1.0.
--
-- Starts playing a sound on all clients who are online in the server.
------
RegisterNetEvent('InteractSound_CL:PlayOnAll')
AddEventHandler('InteractSound_CL:PlayOnAll', function(soundFile, soundVolume)
    if hasPlayerLoaded then
        SendNUIMessage({
            transactionType = 'playSound',
            transactionFile = soundFile,
            transactionVolume = soundVolume or standardVolumeOutput
        })
    end
end)

------
-- RegisterNetEvent LIFE_CL:Sound:PlayWithinDistance
--
-- @param playOnEntity    - The entity network id (will be converted from net id to entity on client)
--                        - of the entity for which the max distance is to be drawn from.
-- @param maxDistance     - The maximum float distance (client uses Vdist) to allow the player to
--                        - hear the soundFile being played.
-- @param soundFile       - The name of the soundfile within the client/html/sounds/ folder.
--                        - Can also specify a folder/sound file.
-- @param soundVolume     - The volume at which the soundFile should be played. Nil or don't
--                        - provide it for the default of standardVolumeOutput. Should be between
--                        - 0.1 to 1.0.
--
-- Starts playing a sound on a client if the client is within the specificed maxDistance from the playOnEntity.
-- @TODO Change sound volume based on the distance the player is away from the playOnEntity.
------
RegisterNetEvent('InteractSound_CL:PlayWithinDistance')
AddEventHandler('InteractSound_CL:PlayWithinDistance', function(otherPlayerCoords, maxDistance, soundFile, soundVolume)
	if hasPlayerLoaded then
		local myCoords = GetEntityCoords(PlayerPedId())
		local distance = #(myCoords - otherPlayerCoords)

		if distance < maxDistance then
			SendNUIMessage({
				transactionType = 'playSound',
				transactionFile  = soundFile,
				transactionVolume = soundVolume or standardVolumeOutput
			})
		end
	end
end)

local loop
RegisterNetEvent('InteractSound_CL:PlayWithinDistanceRatioLoop')
AddEventHandler('InteractSound_CL:PlayWithinDistanceRatioLoop', function(location, maxDistance, soundFile, soundVolume)
	if hasPlayerLoaded then
        local locationCoords = vector3(location[1], location[2], location[3])
		local myCoords = GetEntityCoords(PlayerPedId())
		local distance = #(myCoords - locationCoords)
        local baseVolume = soundVolume or standardVolumeOutput
        local volume = 0
        if distance < maxDistance then
            volume = (maxDistance - distance) / maxDistance * baseVolume
        end

        SendNUIMessage({
            transactionType = 'playLoopSound',
            transactionFile  = soundFile,
            transactionVolume = volume,
        })

        loop = true

        CreateThread(function()
            while loop do
                Wait(1000)
                local myCoords = GetEntityCoords(PlayerPedId())
                local distance = #(myCoords - locationCoords)
                local baseVolume = soundVolume or standardVolumeOutput
                local volume = 0
                if distance < maxDistance then
                    volume = (maxDistance - distance) / maxDistance * baseVolume
                end

                SendNUIMessage({
                    transactionType = 'updatevolume',
                    transactionVolume = volume,
                })
            end
        end)
	end
end)

RegisterNetEvent('InteractSound_CL:Stoploop')
AddEventHandler('InteractSound_CL:Stoploop', function()
    loop = false
    SendNUIMessage({
        transactionType = 'stopLoopSound'
    })
end)

