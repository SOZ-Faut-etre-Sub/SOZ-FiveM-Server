QBCore = exports["qb-core"]:GetCoreObject()

function tablelenght(table)
    local count = 0
    for _ in pairs(table) do count = count + 1 end
    print(count)
    return count
end

RegisterNetEvent("soz-housing:server:isOwned")
AddEventHandler("soz-housing:server:isOwned", function(name)
    local Player = QBCore.Functions.GetPlayer(source)
    local HouseOwner = MySQL.query.await("SELECT `owner` FROM `player_house` WHERE `identifier` = @id", {["@id"] = name})
    if tablelenght(HouseOwner) == 1 then
        for _, v in pairs(HouseOwner) do
            if v.owner ~= nil then
                TriggerClientEvent("soz-housing:client:setOwned", Player.PlayerData.source, true)
                if v.owner == Player.PlayerData.citizenid then
                    TriggerClientEvent("soz-housing:client:setOwner", Player.PlayerData.source, true)
                end
            end
        end
    end
end)