QBCore = exports["qb-core"]:GetCoreObject()
PlayerData = QBCore.Functions.GetPlayerData()

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent("QBCore:Player:SetPlayerData", function(data)
    PlayerData = data
end)

CreateThread(function()
    for id,bank in pairs(Config.BankPedLocations) do
        if not QBCore.Functions.GetBlip("bank_"..id) then
            QBCore.Functions.CreateBlip("bank_"..id, {
                name = 'Banque',
                coords = bank,
                sprite = 108,
                color = 2,
            })
        end
    end
end)

exports['qb-target']:AddTargetModel({ "ig_bankman" }, {
    options = {
        {
            event = "",
            icon = "fas fa-money-check",
            label = "Accéder au compte",
        },
    },
    distance = 2.5,
})
