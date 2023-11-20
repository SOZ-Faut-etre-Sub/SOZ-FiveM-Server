RegisterNetEvent("inventory:client:openPlayerWalletInventory", function(cards)
    local playerCards = {}

    for cardId, card in pairs(cards) do

        playerCards[#playerCards + 1] = {
            type = "card",
            name = card.type, -- Used for icon
            label = card.label,
            description = card.description,
            metadata = {iban = card.iban},
        }
    end
    SendNUIMessage({action = "openPlayerWalletInventory", cards = playerCards})
    SetNuiFocus(true, true)
    InventoryOpen = true
end)

RegisterKeyMapping("open-wallet", "Ouvrir le portefeuille", "keyboard", "")
RegisterCommand("open-wallet", function()
    TriggerServerEvent("soz-core:server:player:open-wallet")
end, false)

RegisterNUICallback("player/openPlayerWalletInventory", function(data, cb)
    TriggerServerEvent("soz-core:server:player:open-wallet")
    cb(true)
end)

RegisterNUICallback("player/showCard", function(data, cb)
    local cardType = data.name;
    local accountId = data.metadata.iban
    TriggerEvent("soz-core:client:player:card:show", cardType, accountId)
    cb(true)
end)

RegisterNUICallback("player/seeCard", function(data, cb)
    local cardType = data.name;
    TriggerEvent("soz-core:client:player:card:see", {type = cardType})
    cb(true)
end)
