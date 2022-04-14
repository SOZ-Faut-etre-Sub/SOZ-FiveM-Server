QBCore = exports["qb-core"]:GetCoreObject()

function tablelenght(table)
    local count = 0
    for _ in pairs(table) do count = count + 1 end
    return count
end

RegisterNetEvent("soz-housing:server:isOwned")
AddEventHandler("soz-housing:server:isOwned", function(name)
    local Player = QBCore.Functions.GetPlayer(source)
    local HouseOwner = MySQL.query.await("SELECT `owner` FROM `player_house` WHERE `identifier` = @id", {["@id"] = name})
    local Coords = MySQL.query.await("SELECT `coordx`, `coordy`, `coordz`, `coordw` FROM `player_house` WHERE `identifier` = @id", {["@id"] = name})
    if tablelenght(HouseOwner) == 1 then
        for _, v in pairs(HouseOwner) do
            if v.owner ~= nil then
                if v.owner == Player.PlayerData.citizenid then
                    TriggerClientEvent("soz-housing:client:setData", Player.PlayerData.source, true, true, Coords)
                else
                    TriggerClientEvent("soz-housing:client:setData", Player.PlayerData.source, false, true, Coords)
                end
            else
                TriggerClientEvent("soz-housing:client:setData", Player.PlayerData.source, false, false)
            end
        end
    end
end)

RegisterNetEvent("soz-housing:server:ShowAcheter")
AddEventHandler("soz-housing:server:ShowAcheter", function(name)
    local Player = QBCore.Functions.GetPlayer(source)
    local HouseData = MySQL.query.await("SELECT * FROM `player_house` WHERE `identifier` = @id", {["@id"] = name})
    TriggerClientEvent("soz-housing:client:Acheter", Player.PlayerData.source, HouseData)
end)

RegisterNetEvent("soz-housing:server:ShowVendre")
AddEventHandler("soz-housing:server:ShowVendre", function(name)
    local Player = QBCore.Functions.GetPlayer(source)
    local HouseData = MySQL.query.await("SELECT * FROM `player_house` WHERE `identifier` = @id", {["@id"] = name})
    TriggerClientEvent("soz-housing:client:Vendre", Player.PlayerData.source, HouseData)
end)

RegisterNetEvent("soz-housing:server:buy")
AddEventHandler("soz-housing:server:buy", function(name, price)
    local Player = QBCore.Functions.GetPlayer(source)
    local BuyOrder = MySQL.update.await("UPDATE player_house SET OWNER = @citizenid WHERE identifier = @id", {["@id"] = name, ["@citizenid"] = Player.PlayerData.citizenid})
    TriggerEvent("banking:server:TransfertMoney", Player.PlayerData.charinfo.account, name, price)
    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Bravo vous venez d'acheter l'habitation")
end)

RegisterNetEvent("soz-housing:server:sell")
AddEventHandler("soz-housing:server:sell", function(name, price)
    local Player = QBCore.Functions.GetPlayer(source)
    local BuyOrder = MySQL.update.await("UPDATE player_house SET OWNER = NULL WHERE identifier = @id", {["@id"] = name})
    Player.Functions.AddMoney("money", price)
    TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Bravo vous avez vendu l'habitation")
end)