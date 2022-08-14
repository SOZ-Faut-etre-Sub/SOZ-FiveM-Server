QBCore = exports["qb-core"]:GetCoreObject()

RegisterServerEvent("lsmc:maladie:server:SetCurrentDisease")
AddEventHandler("lsmc:maladie:server:SetCurrentDisease", function(disease, id)
    local Player = QBCore.Functions.GetPlayer(id or source)

    if disease ~= "grippe" then
        Player.Functions.SetMetaData("disease", disease)
        TriggerClientEvent("lsmc:maladie:client:ApplyCurrentDiseaseEffect", Player.PlayerData.source, disease)
    elseif disease == "grippe" and not Player.PlayerData.metadata["hazmat"] then
        Player.Functions.SetMetaData("disease", disease)
        TriggerClientEvent("lsmc:maladie:client:ApplyCurrentDiseaseEffect", Player.PlayerData.source, disease)
    end
end)

RegisterServerEvent("lsmc:surgery:server:SetCurrentOrgan")
AddEventHandler("lsmc:surgery:server:SetCurrentOrgan", function(organe, id)
    local Player = QBCore.Functions.GetPlayer(id or source)
    Player.Functions.SetMetaData("organ", organe)

    TriggerClientEvent("lsmc:surgery:client:ApplyCurrentOrgan", Player.PlayerData.source, organe)
end)

RegisterServerEvent("lsmc:server:SetHazmat")
AddEventHandler("lsmc:server:SetHazmat", function(hazmat)
    local Player = QBCore.Functions.GetPlayer(source)

    Player.Functions.SetMetaData("hazmat", hazmat)
end)

QBCore.Functions.CreateCallback("lsmc:server:GetCurrentOrgan", function(source, cb, id)
    local Player = QBCore.Functions.GetPlayer(id)
    local organ = Player.PlayerData.metadata["organ"]
    if organ == nil then
        organ = false
    end
    cb(organ)
end)

RegisterServerEvent("ems:server:onDeath", function()
    local player = QBCore.Functions.GetPlayer(source)
    player.Functions.SetMetaData("isdead", true)
    Player(player.PlayerData.source).state.isdead = true
end)

RegisterServerEvent("lsmc:server:SetMort")
AddEventHandler("lsmc:server:SetMort", function(ReasonMort)
    local player = QBCore.Functions.GetPlayer(source)
    local deathDescription = string.format("%s", ReasonMort or "")

    player.Functions.SetMetaData("mort", deathDescription)
    player.Functions.SetMetaData("isdead", true)
    Player(player.PlayerData.source).state.isdead = true

    TriggerEvent("monitor:server:event", "player_dead", {player_source = player.PlayerData.source}, {
        reason = deathDescription,
    })
end)

RegisterServerEvent("lsmc:server:GetMort")
AddEventHandler("lsmc:server:GetMort", function(id)
    local TargetPlayer = QBCore.Functions.GetPlayer(id)
    local Player = QBCore.Functions.GetPlayer(source)
    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, TargetPlayer.PlayerData.metadata["mort"])
end)
