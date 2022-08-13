local auctions = {}

CreateThread(function()
    local result = MySQL.Sync.fetchAll("SELECT * FROM vehicles WHERE category IN (?) AND price > 0 ORDER BY RAND () LIMIT ?", { LuxuryDealershipConfig.AllowedCategories, #LuxuryDealershipConfig.Spawns })
    for i, vehicle in ipairs(result) do
        local spawn = LuxuryDealershipConfig.Spawns[i]
        auctions[vehicle.model] = {
            model = vehicle.model,
            hash = vehicle.hash,
            name = vehicle.name,
            pos = spawn.vehicle,
            window = spawn.window,
            minimumBidPrice = vehicle.price,
            bestBidCitizenId = nil,
            bestBidName = nil,
            bestBidPrice = nil,
            required_licence = vehicle.required_licence
        }
        auctions[vehicle.model].window.options.name = "luxury_" .. vehicle.model
    end
end)

QBCore.Functions.CreateCallback("soz-dealership:server:GetAuctions", function(source, cb)
    cb(auctions)
end)

QBCore.Functions.CreateCallback("soz-dealership:server:GetAuction", function(source, cb, model)
    cb(auctions[model])
end)

QBCore.Functions.CreateCallback("soz-dealership:server:BidAuction", function(source, cb, vehicleModel, price)
    price = math.floor(price)
    local auction = auctions[vehicleModel]
    if auction == nil then
        cb(false, "Ce véhicule n'est pas proposé à la mise aux enchères.")
    end
    if price < (auction.bestBidPrice or auction.minimumBidPrice) then
        cb(false, "Le montant doit être supérieur à " .. (auction.bestBidPrice or auction.minimumBidPrice))
    end

    local player = QBCore.Functions.GetPlayer(source)
    auction.bestBidCitizenId = player.PlayerData.citizenid
    auction.bestBidName = player.PlayerData.charinfo.firstname .. " " .. player.PlayerData.charinfo.lastname
    auction.bestBidPrice = price
    cb(true, nil)
end)

exports('finishAuctions', function()
    for _, auction in pairs(auctions) do
        if auction.bestBidPrice ~= nil then
            local PlayerData = exports.oxmysql:singleSync('SELECT * FROM player where citizenid = ?', { auction.bestBidCitizenId })
            local playerMoney = json.decode(PlayerData.money)

            if playerMoney.money >= auction.bestBidPrice then
                playerMoney.money = math.floor(playerMoney.money - auction.bestBidPrice)
                exports.oxmysql:singleSync('UPDATE player SET money = ? WHERE citizenid = ?', { json.encode(playerMoney), auction.bestBidCitizenId})

                exports.oxmysql:insertSync(
                    "INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, `condition`, plate, garage, category, state, life_counter, boughttime, parkingtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    {
                        PlayerData.license,
                        auction.bestBidCitizenId,
                        auction.model,
                        auction.hash,
                        "{}",
                        "{}",
                        GeneratePlate(),
                        "airportpublic",
                        "car",
                        1,
                        3,
                        os.time(),
                        os.time(),
                    })
                print("[soz-vehicle] Le joueur " .. auction.bestBidName .. " a remporté une " .. auction.model .. " pour " .. auction.bestBidPrice)
            else
                print("[soz-vehicle] Le joueur " .. auction.bestBidName .. " n'avait pas les fonds au moment de la finalisation de l'achat d'une " .. auction.model)
            end
        end
    end
end)
