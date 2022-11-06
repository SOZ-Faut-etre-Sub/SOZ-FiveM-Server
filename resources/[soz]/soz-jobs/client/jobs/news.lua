local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_news", "soz", "news:menu")
local removalObject = {"prop_ld_greenscreen_01", "prop_tv_cam_02", "prop_kino_light_01", "v_ilev_fos_mic"}

--- Targets
CreateThread(function()
    exports["qb-target"]:AddBoxZone("news:duty", vector3(-587.75, -934.67, 23.82), 0.4, 0.8, {
        name = "news:duty",
        heading = 32,
        minZ = 23.72,
        maxZ = 24.32,
    }, {options = SozJobCore.Functions.GetDutyActions("news"), distance = 2.5})

    exports["qb-target"]:AddTargetModel(removalObject, {
        options = {
            {
                label = "Récupérer",
                color = "news",
                icon = "c:jobs/recuperer.png",
                event = "job:client:RemoveObject",
                job = "news",
                collect = true,
            },
        },
        distance = 2.5,
    })

    exports["qb-target"]:AddBoxZone("jobs:news:farm", vector3(-564.09, -917.33, 33.34), 1, 1, {
        name = "jobs:news:sell",
        minZ = 32.34,
        maxZ = 33.5,
    }, {
        options = {
            {
                label = "Imprimer",
                color = "news",
                icon = "c:news/imprimer.png",
                event = "jobs:client:news:farmNewspaper",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
                job = "news",
            },
        },
        distance = 2.5,
    })
end)

--- Events
RegisterNetEvent("jobs:client:news:OpenCloakroomMenu", function(storageId)
    SozJobCore.Functions.OpenCloakroomMenu(societyMenu, NewsConfig.Cloakroom, storageId)
end)

RegisterNetEvent("jobs:client:news:SellNewspaper", function()
    if QBCore.Functions.GetBlip("jobs:news:sell") ~= false then
        return
    end

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
                label = "Livrer",
                color = "news",
                icon = "c:news/livrer.png",
                event = "jobs:client:news:newspaperSold",
                canInteract = function()
                    return PlayerData.job.onduty
                end,
                job = "news",
            },
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

RegisterNetEvent("jobs:client:news:OpenSocietyMenu", function()
    if societyMenu.IsOpen then
        societyMenu:Close()
        return
    end
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

            TriggerServerEvent("phone:app:news:createNewsBroadcast", "phone:app:news:createNewsBroadcast:" .. QBCore.Shared.UuidV4(), {
                type = value,
                message = message,
                reporter = PlayerData.charinfo.firstname .. " " .. PlayerData.charinfo.lastname,
                reporterId = PlayerData.citizenid,
            })

            TriggerServerEvent("monitor:server:event", "job_news_create_flash", {flash_type = value},
                               {message = message, position = GetEntityCoords(PlayerPedId())}, true)
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

--- Threads
CreateThread(function()
    QBCore.Functions.CreateBlip("jobs:news", {
        name = "Twitch News",
        coords = vector3(-589.86, -930.61, 23.82),
        sprite = 590,
        scale = 1.0,
    })
end)
