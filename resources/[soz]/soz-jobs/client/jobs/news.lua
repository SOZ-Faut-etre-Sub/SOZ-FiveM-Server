local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_news", "soz", "news:menu")
local shopMenu = MenuV:CreateMenu(nil, nil, "menu_shop_society", "soz", "job:news:shop:menu")
local removalObject = {"prop_ld_greenscreen_01", "prop_tv_cam_02", "prop_kino_light_01", "v_ilev_fos_mic"}

--- Targets
CreateThread(function()
    exports["qb-target"]:AddGlobalPlayer({
        options = {
            {label = "Facturer", icon = "c:jobs/facture.png", event = "jobs:client:news:InvoicePlayer", job = "news"},
        },
        distance = 1.5,
    })

    exports["qb-target"]:AddBoxZone("news:duty", vector3(-587.75, -934.67, 23.82), 0.4, 0.8,
                                    {name = "news:cloakroom", heading = 32, minZ = 23.72, maxZ = 24.32},
                                    {options = SozJobCore.Functions.GetDutyActions("news"), distance = 2.5})

    exports["qb-target"]:AddTargetModel(removalObject, {
        options = {
            {label = "Récupérer", icon = "c:jobs/recuperer.png", event = "job:client:RemoveObject", collect = true},
        },
        distance = 2.5,
    })

    exports["qb-target"]:AddBoxZone("jobs:news:farm", vector3(-564.09, -917.33, 33.34), 1, 1, {
        name = "jobs:news:sell",
        minZ = 32.34,
        maxZ = 33.5,
    }, {
        options = {
            {label = "Imprimer", icon = "c:news/imprimer.png", event = "jobs:client:news:farmNewspaper", job = "news"},
        },
        distance = 2.5,
    })

    exports["qb-target"]:AddBoxZone("news:shop", vector3(-567.59, -922.01, 28.82), 0.4, 2.8, {
        name = "news:shop",
        heading = 0,
        minZ = 27.82,
        maxZ = 30.82,
    }, {
        options = {
            {
                label = "Récupérer du matériel",
                icon = "fas fa-briefcase",
                event = "news:client:bossShop",
                canInteract = function()
                    return SozJobCore.Functions.HasPermission("news", SozJobCore.JobPermission.ManageGrade)
                end,
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
            {label = "Livrer", icon = "c:news/livrer.png", event = "jobs:client:news:newspaperSold", job = "news"},
        },
        distance = 2.5,
    })

    QBCore.Functions.CreateBlip("jobs:news:sell", {name = "Point de livraison", coords = delivery, route = true})

    exports["soz-hud"]:DrawNotification("Une station a besoin de journaux. Sa position est sur ton ~y~GPS", "info")
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
        exports["soz-hud"]:DrawNotification("Vous devez spécifier un title", "error")
        return
    end

    local amount = exports["soz-hud"]:Input("Montant", 10)
    if amount == nil or tonumber(amount) == nil or tonumber(amount) <= 0 then
        exports["soz-hud"]:DrawNotification("Vous devez spécifier un montant", "error")
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
                exports["soz-hud"]:DrawNotification("Vous devez spécifier un message", "error")
                return
            end

            TriggerServerEvent("phone:app:news:createNewsBroadcast", "phone:app:news:createNewsBroadcast:" .. QBCore.Shared.UuidV4(),
                               {
                type = value,
                message = message,
                reporter = PlayerData.charinfo.firstname .. " " .. PlayerData.charinfo.lastname,
            })
        end,
    })

    societyMenu:AddSlider({
        label = "Poser un objet",
        value = nil,
        values = {
            {label = "Fond vert", value = {item = "n_fix_greenscreen", props = "prop_ld_greenscreen_01"}},
            {label = "Caméra fixe", value = {item = "n_fix_camera", props = "prop_tv_cam_02", rotation = 180.0}},
            {label = "Lumière fixe", value = {item = "n_fix_light", props = "prop_kino_light_01", rotation = 180.0}},
            {label = "Micro sur pied", value = {item = "n_fix_mic", props = "v_ilev_fos_mic"}},
        },
        select = function(_, value)
            TriggerServerEvent("job:server:placeProps", value.item, value.props, value.rotation)
            societyMenu:Close()
        end,
    })

    societyMenu:AddSlider({
        label = "Utiliser un objet mobile",
        value = nil,
        values = {
            {label = "Caméra", value = {item = "n_camera", event = "jobs:utils:camera:toggle"}},
            {label = "Micro main", value = {item = "n_mic", event = "jobs:utils:mic:toggle"}},
            {label = "Micro sur une perche", value = {item = "n_bmic", event = "jobs:utils:bmic:toggle"}},
        },
        select = function(_, value)
            TriggerServerEvent("jobs:server:news:UseMobileItem", value.item, value.event)
            societyMenu:Close()
        end,
    })

    societyMenu:Open()
end)

RegisterNetEvent("news:client:bossShop", function()
    if not SozJobCore.Functions.HasPermission("news", SozJobCore.JobPermission.ManageGrade) then

        return
    end

    shopMenu:ClearItems()
    for itemID, item in pairs(NewsConfig.BossShop) do
        shopMenu:AddButton({
            label = item.amount .. "x " .. QBCore.Shared.Items[item.name].label,
            rightLabel = "$" .. item.price,
            value = itemID,
            select = function(btn)
                TriggerServerEvent("news:server:buy", btn.Value)
            end,
        })
    end

    shopMenu:Open()
end)

--- Threads
CreateThread(function()
    QBCore.Functions.CreateBlip("jobs:news", {
        name = "Twitch News",
        coords = vector3(-589.86, -930.61, 23.82),
        sprite = 590,
        scale = 1.0,
    })
end)
