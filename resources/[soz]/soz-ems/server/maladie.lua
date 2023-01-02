QBCore = exports["qb-core"]:GetCoreObject()

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
