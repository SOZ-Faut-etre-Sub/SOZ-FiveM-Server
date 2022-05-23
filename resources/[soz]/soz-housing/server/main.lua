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

    if Player.Functions.RemoveMoney("money", price) then
        MySQL.update.await("UPDATE player_house SET OWNER = @citizenid WHERE identifier = @id", {
            ["@id"] = name,
            ["@citizenid"] = Player.PlayerData.citizenid,
        })

        TriggerEvent("monitor:server:event", "house_buy", {player_source = Player.PlayerData.source}, {
            house_id = name,
            amount = price,
        })

        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Bravo vous venez d'acheter l'habitation.")
        TriggerEvent("soz-housing:server:SyncAvailableHousing")
    else
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Vous n'avez pas assez d'argent sur vous.", "error")
    end
end)

RegisterNetEvent("soz-housing:server:sell")
AddEventHandler("soz-housing:server:sell", function(name, price)
    local Player = QBCore.Functions.GetPlayer(source)

    if Player.Functions.AddMoney("money", price / 2) then
        MySQL.update.await("UPDATE player_house SET OWNER = NULL WHERE identifier = @id", {["@id"] = name})
        TriggerClientEvent("hud:client:DrawNotification", Player.PlayerData.source, "Bravo vous avez vendu l'habitation.")
        TriggerEvent("soz-housing:server:SyncAvailableHousing")
    end
end)

RegisterNetEvent("soz-housing:server:SyncAvailableHousing")
AddEventHandler("soz-housing:server:SyncAvailableHousing", function()
    local AvailableHousing = MySQL.query.await("SELECT identifier, entry_zone FROM player_house WHERE owner IS NULL")

    TriggerClientEvent("soz-housing:client:SyncAvailableHousing", -1, AvailableHousing)
end)

QBCore.Functions.CreateCallback("soz-housing:server:GetAvailableHousing", function(source, cb)
    local AvailableHousing = MySQL.query.await("SELECT identifier, entry_zone FROM player_house WHERE owner IS NULL")

    cb(AvailableHousing)
end)
