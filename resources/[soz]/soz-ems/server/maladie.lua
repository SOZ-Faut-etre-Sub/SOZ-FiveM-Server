QBCore = exports["qb-core"]:GetCoreObject()

RegisterServerEvent("lsmc:server:GetMaladie")
AddEventHandler("lsmc:server:GetMaladie", function()
    local Player = QBCore.Functions.GetPlayer(source)
    Rhume = Player.PlayerData.metadata['rhume']
    Grippe = Player.PlayerData.metadata['grippe']
    Rougeur = Player.PlayerData.metadata['rougeur']
    Intoxication = Player.PlayerData.metadata['intoxication']
end)

RegisterServerEvent("lsmc:server:SetMaladie")
AddEventHandler("lsmc:server:SetMaladie", function(maladie, val)
    local Player = QBCore.Functions.GetPlayer(source)
    Player.Functions.SetMetaData(maladie, val)
end)