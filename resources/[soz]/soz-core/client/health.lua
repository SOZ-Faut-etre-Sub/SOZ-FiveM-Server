isDead = false

RegisterNetEvent("core:client:KillPlayer")
AddEventHandler("core:client:KillPlayer", function()
    SetEntityHealth(PlayerPedId(), 0)
end)

RegisterNetEvent("core:client:Revive")
AddEventHandler("core:client:Revive", function()
    local player = PlayerPedId()

    if isDead then
        local playerPos = GetEntityCoords(player, true)
        NetworkResurrectLocalPlayer(playerPos, true, true, false)
        isDead = false
        SetEntityInvincible(player, false)
    end

    SetEntityMaxHealth(player, 200)
    SetEntityHealth(player, 200)
    ClearPedBloodDamage(player)
    SetPlayerSprint(PlayerId(), true)
    ResetAll()
    ResetPedMovementClipset(player, 0.0)

    QBCore.Functions.Notify("Vous êtes guéri!")
end)

function ResetAll()
    TriggerServerEvent("QBCore:Server:SetMetaData", "hunger", 100)
    TriggerServerEvent("QBCore:Server:SetMetaData", "thirst", 100)
end
