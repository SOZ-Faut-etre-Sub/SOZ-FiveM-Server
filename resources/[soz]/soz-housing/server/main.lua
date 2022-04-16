QBCore = exports["qb-core"]:GetCoreObject()

function tablelenght(table)
    local count = 0
    for _ in pairs(table) do
        count = count + 1
    end
    return count
end

RegisterNetEvent("soz-housing:server:SetZone")
AddEventHandler("soz-housing:server:SetZone", function()
    local Player = QBCore.Functions.GetPlayer(source)
    local GlobalZone = MySQL.query.await("SELECT * FROM `player_house`")
    TriggerClientEvent("soz-housing:client:SetEntry", Player.PlayerData.source, GlobalZone)
    TriggerClientEvent("soz-housing:client:SetExit", Player.PlayerData.source, GlobalZone)
end)

RegisterNetEvent("soz-housing:server:isOwned")
AddEventHandler("soz-housing:server:isOwned", function(name)
    local Player = QBCore.Functions.GetPlayer(source)
    local HouseOwner = MySQL.query.await("SELECT `owner` FROM `player_house` WHERE `identifier` = @id", {["@id"] = name})
    if tablelenght(HouseOwner) == 1 then
        local Coords = MySQL.query.await("SELECT `teleport` FROM `player_house` WHERE `identifier` = @id", {
            ["@id"] = name,
        })
        for _, v in pairs(HouseOwner) do
            if v.owner ~= nil then
                if v.owner == Player.PlayerData.citizenid then
                    TriggerClientEvent("soz-housing:client:setData", Player.PlayerData.source, true, true, false, Coords)
                else
                    TriggerClientEvent("soz-housing:client:setData", Player.PlayerData.source, false, true, false, Coords)
                end
            else
                TriggerClientEvent("soz-housing:client:setData", Player.PlayerData.source, false, false, false)
            end
        end
    else
        local BuildingOwner = MySQL.query.await("SELECT `owner` FROM `player_house` WHERE `building` = @id", {
            ["@id"] = name,
        })
        local isOwned = false
        local isOwner = false
        local count = 0
        for _, v in pairs(BuildingOwner) do
            if v.owner ~= nil then
                count = count + 1
            end
            if v.owner == Player.PlayerData.citizenid then
                isOwner = true
            end
        end
        if count == tablelenght(BuildingOwner) then
            isOwned = true
        end
        if isOwner then
            if isOwned then
                TriggerClientEvent("soz-housing:client:setData", Player.PlayerData.source, true, true, true, nil)
            else
                TriggerClientEvent("soz-housing:client:setData", Player.PlayerData.source, true, false, true, nil)
            end
        else
            if isOwned then
                TriggerClientEvent("soz-housing:client:setData", Player.PlayerData.source, false, true, true, nil)
            else
                TriggerClientEvent("soz-housing:client:setData", Player.PlayerData.source, false, false, true, nil)
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

RegisterNetEvent("soz-housing:server:BuildingShowAcheter")
AddEventHandler("soz-housing:server:BuildingShowAcheter", function(name)
    local Player = QBCore.Functions.GetPlayer(source)
    local HouseData = MySQL.query.await("SELECT * FROM `player_house` WHERE `building` = @id AND `owner` IS null", {
        ["@id"] = name,
    })
    TriggerClientEvent("soz-housing:client:Acheter", Player.PlayerData.source, HouseData)
end)

RegisterNetEvent("soz-housing:server:ShowVendre")
AddEventHandler("soz-housing:server:ShowVendre", function(name)
    local Player = QBCore.Functions.GetPlayer(source)
    local HouseData = MySQL.query.await("SELECT * FROM `player_house` WHERE `identifier` = @id", {["@id"] = name})
    TriggerClientEvent("soz-housing:client:Vendre", Player.PlayerData.source, HouseData)
end)

RegisterNetEvent("soz-housing:server:BuildingShowVendre")
AddEventHandler("soz-housing:server:BuildingShowVendre", function(name)
    local Player = QBCore.Functions.GetPlayer(source)
    local HouseData = MySQL.query.await("SELECT * FROM `player_house` WHERE `building` = @id AND `owner` = @citizenid",
                                        {["@id"] = name, ["@citizenid"] = Player.PlayerData.citizenid})
    TriggerClientEvent("soz-housing:client:Vendre", Player.PlayerData.source, HouseData)
end)

RegisterNetEvent("soz-housing:server:BuildingShowRentrer")
AddEventHandler("soz-housing:server:BuildingShowRentrer", function(name)
    local Player = QBCore.Functions.GetPlayer(source)
    local HouseData = MySQL.query.await("SELECT * FROM `player_house` WHERE `building` = @id AND `owner` = @citizenid",
                                        {["@id"] = name, ["@citizenid"] = Player.PlayerData.citizenid})
    TriggerClientEvent("soz-housing:client:Rentrer", Player.PlayerData.source, HouseData)
end)

RegisterNetEvent("soz-housing:server:buy")
AddEventHandler("soz-housing:server:buy", function(name, price)
    local Player = QBCore.Functions.GetPlayer(source)
    local succes, reason = TriggerEvent("banking:server:TransfertMoney", Player.PlayerData.charinfo.account, name, price)
    if succes then
        local BuyOrder = MySQL.update.await("UPDATE player_house SET OWNER = @citizenid WHERE identifier = @id",
                                            {["@id"] = name, ["@citizenid"] = Player.PlayerData.citizenid})
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Bravo vous venez d'acheter l'habitation")
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, reason)
    end
end)

RegisterNetEvent("soz-housing:server:sell")
AddEventHandler("soz-housing:server:sell", function(name, price)
    local Player = QBCore.Functions.GetPlayer(source)
    local succes, reason = TriggerEvent("banking:server:TransfertMoney", name, Player.PlayerData.charinfo.account, price)
    if succes then
        local SellOrder = MySQL.update.await("UPDATE player_house SET OWNER = NULL WHERE identifier = @id", {
            ["@id"] = name,
        })
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Bravo vous avez vendu l'habitation")
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, reason)
    end
end)
