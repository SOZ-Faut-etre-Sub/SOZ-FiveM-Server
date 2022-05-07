QBCore = exports["qb-core"]:GetCoreObject()

QBCore.Functions.CreateCallback("soz-admin:housing:server:GetHousing", function(source, cb)
    local Housing = MySQL.query.await("SELECT * FROM `player_house` WHERE identifier IS NOT NULL")
    cb(Housing)
end)

QBCore.Functions.CreateCallback("soz-admin:housing:server:GetBuilding", function(source, cb)
    local Building = MySQL.query.await("SELECT * FROM `player_house` WHERE `building` IS NOT NULL AND `entry_zone` IS NOT NULL")
    cb(Building)
end)

function round(num, numDecimalPlaces)
    local mult = 10 ^ (numDecimalPlaces or 0)
    return math.floor(num * mult + 0.5) / mult
end

RegisterNetEvent("soz-admin:server:housing", function(zone, id, zonetype)
    local endzone = "{\"x\": " .. round(zone.center.x, 2)
    endzone = endzone .. ", \"y\": "
    endzone = endzone .. round(zone.center.y, 2) .. ", \"z\": "
    endzone = endzone .. round(zone.center.z, 2) .. ", \"sx\": "
    endzone = endzone .. zone.length .. ", \"sy\": "
    endzone = endzone .. zone.width .. ", \"heading\": "
    endzone = endzone .. zone.heading
    if zone.minZ then
        endzone = endzone .. ", \"minZ\": " .. round(zone.minZ, 2)
    end
    if zone.maxZ then
        endzone = endzone .. ", \"maxZ\": " .. round(zone.maxZ, 2)
    end
    endzone = endzone .. "}"
    if zonetype == "closet_position" then
        MySQL.update.await("UPDATE player_house SET closet_position = @zone WHERE identifier = @id", {
            ["@zone"] = endzone,
            ["@id"] = id,
        })
    end
    if zonetype == "fridge_position" then
        MySQL.update.await("UPDATE player_house SET fridge_position = @zone WHERE identifier = @id", {
            ["@zone"] = endzone,
            ["@id"] = id,
        })
    end
    if zonetype == "stash_position" then
        MySQL.update.await("UPDATE player_house SET stash_position = @zone WHERE identifier = @id", {
            ["@zone"] = endzone,
            ["@id"] = id,
        })
    end
    if zonetype == "money_position" then
        MySQL.update.await("UPDATE player_house SET money_position = @zone WHERE identifier = @id", {
            ["@zone"] = endzone,
            ["@id"] = id,
        })
    end
    if zonetype == "entry_zone" then
        MySQL.update.await("UPDATE player_house SET entry_zone = @zone WHERE identifier = @id", {
            ["@zone"] = endzone,
            ["@id"] = id,
        })
    end
    if zonetype == "exit_zone" then
        MySQL.update.await("UPDATE player_house SET exit_zone = @zone WHERE identifier = @id", {
            ["@zone"] = endzone,
            ["@id"] = id,
        })
    end
end)

RegisterNetEvent("soz-admin:server:housing:create", function(name, tp, building)
    local coord = "{\"x\": " .. round(tp.x, 2)
    coord = coord .. ", \"y\": "
    coord = coord .. round(tp.y, 2) .. ", \"z\": "
    coord = coord .. round(tp.z, 2) .. "}"
    if building == nil then
        MySQL.insert.await("INSERT INTO player_house (identifier, teleport) VALUES (@name, @tp)", {
            ["@name"] = name,
            ["@tp"] = coord,
        })
    else
        MySQL.insert.await("INSERT INTO player_house (identifier, teleport, building) VALUES (@name, @tp, @building)",
                           {["@name"] = name, ["@tp"] = coord, ["@building"] = building})
    end
end)

RegisterNetEvent("soz-admin:server:housing:CreateBuilding", function(name, zone)
    local endzone = "{\"x\": " .. round(zone.center.x, 2)
    endzone = endzone .. ", \"y\": "
    endzone = endzone .. round(zone.center.y, 2) .. ", \"z\": "
    endzone = endzone .. round(zone.center.z, 2) .. ", \"sx\": "
    endzone = endzone .. zone.length .. ", \"sy\": "
    endzone = endzone .. zone.width .. ", \"heading\": "
    endzone = endzone .. zone.heading
    if zone.minZ then
        endzone = endzone .. ", \"minZ\": " .. round(zone.minZ, 2)
    end
    if zone.maxZ then
        endzone = endzone .. ", \"maxZ\": " .. round(zone.maxZ, 2)
    end
    endzone = endzone .. "}"
    MySQL.insert.await("INSERT INTO player_house (building, entry_zone) VALUES (@name, @endzone)", {
        ["@name"] = name,
        ["@endzone"] = endzone,
    })
end)

RegisterNetEvent("soz-admin:server:housing:ChangeName", function(name, current)
    MySQL.update.await("UPDATE player_house SET identifier = @name WHERE identifier = @current", {
        ["@name"] = name,
        ["@current"] = current,
    })
end)

RegisterNetEvent("soz-admin:server:housing:ChangeBuilding", function(current, name)
    MySQL.update.await("UPDATE player_house SET building = @name WHERE identifier = @current", {
        ["@name"] = name,
        ["@current"] = current,
    })
end)

RegisterNetEvent("soz-admin:server:housing:ChangeTP", function(current, coord)
    MySQL.update.await("UPDATE player_house SET teleport = @coord WHERE identifier = @current", {
        ["@coord"] = coord,
        ["@current"] = current,
    })
end)

