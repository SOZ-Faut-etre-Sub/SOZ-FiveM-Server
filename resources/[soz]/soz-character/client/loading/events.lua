-- Event handler to reset logging
RegisterNetEvent("soz-character:client:start")
AddEventHandler("soz-character:client:start", StartGame)

---- Event handler to reset logging
RegisterNetEvent("soz-character:client:create-new-character")
AddEventHandler("soz-character:client:create-new-character", function(spawnId, firstname, lastname)
    local charInfo = {firstname = firstname, lastname = lastname}

    local character = CreateAndApplyDefaultCharacter(0)

    SpawnPlayer(spawnId)
    CharacterCreate(spawnId, charInfo, character)
end)

RegisterNetEvent("soz-character:client:login-character")
AddEventHandler("soz-character:client:login-character", function(player)
    LogExistingPlayer(player, false)

    local playerPed = PlayerPedId()

    SetPedConfigFlag(playerPed, 35, false)
    SetPedSuffersCriticalHits(playerPed, false)
end)
