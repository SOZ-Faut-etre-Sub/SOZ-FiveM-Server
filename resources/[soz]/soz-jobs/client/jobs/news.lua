local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_news", "soz", "news:menu")

--- Targets
CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {
                label = "Facture",
                icon = "fas fa-file-invoice-dollar",
                event = "jobs:client:news:InvoicePlayer",
                job = "news",
            },
        },
        distance = 1.5,
    })
end)

--- Events
RegisterNetEvent("jobs:client:news:InvoicePlayer", function(data)
    local player = NetworkGetPlayerIndexFromPed(data.entity)

    local title = exports["soz-hud"]:Input("Titre", 200)
    if title == nil or title == "" then
        exports["soz-hud"]:DrawNotification("~r~Vous devez spécifier un title")
        return
    end

    local amount = exports["soz-hud"]:Input("Montant", 10)
    if amount == nil or tonumber(amount) == nil or tonumber(amount) <= 0 then
        exports["soz-hud"]:DrawNotification("~r~Vous devez spécifier un montant")
        return
    end

    TriggerServerEvent("banking:server:sendInvoice", GetPlayerServerId(player), title, amount)
end)

RegisterNetEvent("jobs:client:news:OpenSocietyMenu", function()
    societyMenu:ClearItems()

    societyMenu:AddSlider({
        label = "Faire une communication",
        value = "nil",
        values = {
            {label = "Annonce", value = "annonce"},
            {label = "Breaking News", value = "breaking-news"},
            {label = "Publicité", value = "publicité"},
            {label = "Fait Divers", value = "fait-divers"},
            {label = "Info Traffic", value = "info-traffic"},
        },
        select = function(_, value)
            local message = exports["soz-hud"]:Input("Message de la communication", 512)
            if message == nil or message == "" then
                exports["soz-hud"]:DrawNotification("~r~Vous devez spécifier un message")
                return
            end

            TriggerServerEvent("phone:app:news:createNewsBroadcast", "phone:app:news:createNewsBroadcast:" .. QBCore.Shared.UuidV4(),
                               {type = value, message = message})
        end,
    })

    societyMenu:Open()
end)

--- Threads
CreateThread(function()
    QBCore.Functions.CreateBlip("jobs:news", {
        name = "Twitch News",
        coords = vector3(-589.86, -930.61, 23.82),
        sprite = 590,
        color = 1,
    })
end)
