QBCore = exports["qb-core"]:GetCoreObject()

RegisterServerEvent("lsmc:server:GetMaladie")
AddEventHandler("lsmc:server:GetMaladie", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local Rhume = Player.PlayerData.metadata["rhume"]
    TriggerClientEvent("lsmc:client:SetMaladie", source, "Rhume", Rhume)
    local Grippe = Player.PlayerData.metadata["grippe"]
    TriggerClientEvent("lsmc:client:SetMaladie", source, "Grippe", Grippe)
    local Rougeur = Player.PlayerData.metadata["rougeur"]
    TriggerClientEvent("lsmc:client:SetMaladie", source, "Rougeur", Rougeur)
    local Intoxication = Player.PlayerData.metadata["intoxication"]
    TriggerClientEvent("lsmc:client:SetMaladie", source, "Intoxication", Intoxication)
end)

RegisterServerEvent("lsmc:server:GetOrgane")
AddEventHandler("lsmc:server:GetOrgane", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local Rein = Player.PlayerData.metadata["rein"]
    TriggerClientEvent("lsmc:client:SetMaladie", source, "rein", Rein)
    local Poumon = Player.PlayerData.metadata["poumon"]
    TriggerClientEvent("lsmc:client:SetMaladie", source, "poumon", Poumon)
    local Foie = Player.PlayerData.metadata["foie"]
    TriggerClientEvent("lsmc:client:SetMaladie", source, "foie", Foie)
end)

RegisterServerEvent("lsmc:server:Greffer")
AddEventHandler("lsmc:server:Greffer", function(id)
    local Player = QBCore.Functions.GetPlayer(tonumber(id))
    local Rein = Player.PlayerData.metadata["rein"]
    local Poumon = Player.PlayerData.metadata["poumon"]
    local Foie = Player.PlayerData.metadata["foie"]
    if not Rein and not Poumon and not Foie then
        TriggerClientEvent("lsmc:client:SetOperation", source, true, nil)
    end
    if not Rein and not Poumon and Foie then
        TriggerClientEvent("lsmc:client:SetOperation", source, false, "Foie")
    end
    if not Rein and Poumon and not Foie then
        TriggerClientEvent("lsmc:client:SetOperation", source, false, "Poumon")
    end
    if Rein and not Poumon and not Foie then
        TriggerClientEvent("lsmc:client:SetOperation", source, false, "Rein")
    end
end)

RegisterServerEvent("lsmc:server:SetMaladie")
AddEventHandler("lsmc:server:SetMaladie", function(maladie, val)
    local Player = QBCore.Functions.GetPlayer(source)
    Player.Functions.SetMetaData(maladie, val)
end)

RegisterServerEvent("lsmc:server:SetOrgane")
AddEventHandler("lsmc:server:SetOrgane", function(id, organe, val)
    local Player = QBCore.Functions.GetPlayer(id)
    Player.Functions.SetMetaData(organe, val)
    TriggerClientEvent("lsmc:client:SetMaladie", id, organe, val)
end)

RegisterServerEvent("lsmc:server:SetMort")
AddEventHandler("lsmc:server:SetMort", function(ReasonMort)
    local Player = QBCore.Functions.GetPlayer(source)
    Player.Functions.SetMetaData("mort", ReasonMort)
    Player.Functions.SetMetaData("isdead", true)

    TriggerEvent("monitor:server:event", "player_dead", {player_source = Player.PlayerData.source}, {
        reason = ReasonMort,
    })
end)

RegisterServerEvent("lsmc:server:GetMort")
AddEventHandler("lsmc:server:GetMort", function(id)
    local TargetPlayer = QBCore.Functions.GetPlayer(id)
    local Player = QBCore.Functions.GetPlayer(source)
    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, TargetPlayer.PlayerData.metadata["mort"])
end)
