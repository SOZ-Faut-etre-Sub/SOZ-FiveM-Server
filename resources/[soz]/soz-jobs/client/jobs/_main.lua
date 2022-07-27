shopMenu = MenuV:CreateMenu(nil, nil, "menu_shop_society", "soz", "job:shop:menu")

function DisplayFieldHealth(newVisibility, field, health)
    if newVisibility then
        SendNUIMessage({
            action = "show",
            health = SozJobCore.FieldHealthStates[health],
            field = string.match(field, "%a+"),
        })
    else
        SendNUIMessage({action = "hide"})
    end
end

local function getTitleAndAmountForInvoice()
    local title = exports["soz-hud"]:Input("Titre", 200)
    if title == nil or title == "" then
        exports["soz-hud"]:DrawNotification("Vous devez spécifier un titre", "error")
        return
    end

    local amount = exports["soz-hud"]:Input("Montant", 10)
    if amount == nil or tonumber(amount) == nil or tonumber(amount) <= 0 then
        exports["soz-hud"]:DrawNotification("Vous devez spécifier un montant", "error")
        return
    end

    return title, amount
end

RegisterNetEvent("jobs:client:InvoicePlayer", function(data)
    local player = NetworkGetPlayerIndexFromPed(data.entity)

    local title, amount = getTitleAndAmountForInvoice()
    if title == nil or amount == nil then
        return
    end

    TriggerServerEvent("banking:server:sendInvoice", GetPlayerServerId(player), title, tonumber(amount))
end)

RegisterNetEvent("jobs:client:InvoiceSociety", function(data)
    local player = NetworkGetPlayerIndexFromPed(data.entity)

    local title, amount = getTitleAndAmountForInvoice()
    if title == nil or amount == nil then
        return
    end

    TriggerServerEvent("banking:server:sendSocietyInvoice", GetPlayerServerId(player), title, tonumber(amount))
end)

RegisterNetEvent("jobs:client:bossShop", function(jobConfig)
    if not SozJobCore.Functions.HasPermission(PlayerData.job.id, SozJobCore.JobPermission.SocietyShop) then
        return
    end

    shopMenu:ClearItems()
    for itemID, item in pairs(_G[jobConfig].BossShop or {}) do
        shopMenu:AddButton({
            label = item.amount .. "x " .. QBCore.Shared.Items[item.name].label,
            rightLabel = "$" .. item.price,
            value = itemID,
            select = function(btn)
                TriggerServerEvent("jobs:shop:server:buy", btn.Value)
            end,
        })
    end

    shopMenu:Open()
end)
