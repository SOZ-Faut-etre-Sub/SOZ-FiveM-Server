QBCore = exports["qb-core"]:GetCoreObject()

RegisterServerEvent("lsmc:server:GetMaladie")
AddEventHandler("lsmc:server:GetMaladie", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local Rhume = Player.PlayerData.metadata['rhume']
    TriggerClientEvent("lsmc:client:SetMaladie", source, "Rhume", Poumon)
    local Grippe = Player.PlayerData.metadata['grippe']
    TriggerClientEvent("lsmc:client:SetMaladie", source, "Grippe", Poumon)
    local Rougeur = Player.PlayerData.metadata['rougeur']
    TriggerClientEvent("lsmc:client:SetMaladie", source, "Rougeur", Poumon)
    local Intoxication = Player.PlayerData.metadata['intoxication']
    TriggerClientEvent("lsmc:client:SetMaladie", source, "Intoxication", Poumon)
end)

RegisterServerEvent("lsmc:server:GetOrgane")
AddEventHandler("lsmc:server:GetOrgane", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local Rein = Player.PlayerData.metadata['rein']
    TriggerClientEvent("lsmc:client:SetMaladie", source, "rein", Poumon)
    local Poumon = Player.PlayerData.metadata['poumon']
    TriggerClientEvent("lsmc:client:SetMaladie", source, "poumon", Poumon)
    local Foie = Player.PlayerData.metadata['foie']
    TriggerClientEvent("lsmc:client:SetMaladie", source, "foie", Poumon)
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