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

    exports["qb-target"]:AddBoxZone("jobs:news:farm", vector3(-564.09, -917.33, 33.34), 1, 1, {
        name = "jobs:news:sell",
        minZ = 32.34,
        maxZ = 33.5,
    }, {
        options = {
            {
                label = "Imprimer des journaux",
                icon = "fas fa-print",
                event = "jobs:client:news:farmNewspaper",
                job = "news",
            },
        },
        distance = 2.5,
    })
end)

--- Events
RegisterNetEvent("jobs:client:news:SellNewspaper", function()
    local delivery = NewsConfig.Deliveries[math.random(#NewsConfig.Deliveries)]

    exports["qb-target"]:AddBoxZone("jobs:news:sell", delivery, 1.0, 1.0,
                                    {
        name = "jobs:news:sell",
        heading = delivery.w,
        minZ = delivery.z - 1.5,
        maxZ = delivery.z + 1.5,
    }, {
        options = {
            {
                label = "Livrer des journaux",
                icon = "fas fa-newspaper",
                event = "jobs:client:news:newspaperSold",
                job = "news",
            },
        },
        distance = 2.5,
    })

    QBCore.Functions.CreateBlip("jobs:news:sell", {name = "Point de livraison", coords = delivery, route = true})

    exports["soz-hud"]:DrawNotification("Une station a besoin de journaux. Sa position est sur ton ~y~GPS")
end)

RegisterNetEvent("jobs:client:news:newspaperSold", function()
    TriggerServerEvent("jobs:server:news:newspaperSold")
    exports["qb-target"]:RemoveZone("jobs:news:sell")
    QBCore.Functions.RemoveBlip("jobs:news:sell")
end)

RegisterNetEvent("jobs:client:news:farmNewspaper", function()
    QBCore.Functions.Progressbar("farmNewspaper", "Récupération de journaux", 10000, false, false,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "anim@narcotics@trash", anim = "drop_front", flags = 16}, {}, {}, function()
        StopAnimTask(PlayerPedId(), "anim@narcotics@trash", "drop_front", 1.0)
        TriggerServerEvent("jobs:server:news:newspaperFarm")
    end)
end)

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

    societyMenu:AddSlider({
        label = "Poser un objet",
        value = nil,
        values = {
            {label = "Fond vert", value = {item = "n_fix_greenscreen", props = "prop_ld_greenscreen_01"}},
            {label = "Caméra fixe", value = {item = "n_fix_camera", props = "prop_tv_cam_02"}},
            {label = "Lumière fixe", value = {item = "n_fix_light", props = "prop_kino_light_01"}},
            {label = "Micro sur pied", value = {item = "n_fix_mic", props = "v_ilev_fos_mic"}},
        },
        select = function(_, value)
            TriggerServerEvent("job:server:placeProps", value.item, value.props)
        end,
    })

    societyMenu:AddSlider({
        label = "Utiliser un objet mobile",
        value = nil,
        values = {
            {label = "Caméra", value = {item = "n_camera", event = "Cam:ToggleCam"}},
            {label = "Micro main", value = {item = "n_mic", event = "Mic:ToggleMic"}},
            {label = "Micro sur une perche", value = {item = "n_bmic", event = "Mic:ToggleBMic"}},
        },
        select = function(_, value)
            TriggerServerEvent("jobs:server:news:UseMobileItem", value.item, value.event)
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
    })
end)
