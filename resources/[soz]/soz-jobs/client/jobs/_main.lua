shopMenu = MenuV:CreateMenu(nil, nil, "menu_shop_society", "soz", "job:shop:menu")

RegisterNetEvent("jobs:client:InvoicePlayer", function(data)
    local player = NetworkGetPlayerIndexFromPed(data.entity)

    local title = exports["soz-hud"]:Input("Titre", 200)
    if title == nil or title == "" then
        exports["soz-hud"]:DrawNotification("Vous devez spécifier un title", "error")
        return
    end

    local amount = exports["soz-hud"]:Input("Montant", 10)
    if amount == nil or tonumber(amount) == nil or tonumber(amount) <= 0 then
        exports["soz-hud"]:DrawNotification("Vous devez spécifier un montant", "error")
        return
    end

    TriggerServerEvent("banking:server:sendInvoice", GetPlayerServerId(player), title, tonumber(amount))
end)
