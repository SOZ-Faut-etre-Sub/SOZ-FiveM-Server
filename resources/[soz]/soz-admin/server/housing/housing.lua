QBCore = exports["qb-core"]:GetCoreObject()

QBCore.Functions.CreateCallback("soz-admin:housing:server:GetHousing", function(source, cb)
    local Housing = MySQL.query.await("SELECT * FROM `player_house`")
    cb(Housing)
end)

QBCore.Functions.CreateCallback("soz-admin:housing:server:GetBuilding", function(source, cb)
    local Building = MySQL.query.await("SELECT * FROM `player_house` WHERE `building` IS NOT NULL AND `entry_zone` IS NOT NULL")
    cb(Building)
end)
