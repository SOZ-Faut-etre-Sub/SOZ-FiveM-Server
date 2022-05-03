QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("soz-core:server:dispenser:pay")
AddEventHandler("soz-core:server:dispenser:pay", function(amount, item)
    local Player = QBCore.Functions.GetPlayer(source)
    local CurrentMoney = Player.Functions.GetMoney("money")
    if tonumber(amount) <= tonumber(CurrentMoney) then
        Player.Functions.RemoveMoney("money", amount)
        exports["soz-inventory"]:AddItem(Player.PlayerData.source, item, 1, nil)
    end
end)