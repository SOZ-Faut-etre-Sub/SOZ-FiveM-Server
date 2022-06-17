EmsJob.Functions = {}
EmsJob.Functions.Menu = {}
EmsJob.Menus = {}

CreateThread(function()
    EmsJob.Menus["lsmc"] = {menu = MenuV:CreateMenu(nil, "La sante !", "menu_job_lsmc", "soz", "lsmc:menu")}
end)

local function PropsEntity(menu)
    menu:AddSlider({
        icon = "🚧",
        label = "Poser un objet",
        value = nil,
        values = {
            {label = "Cone de circulation", value = {item = "cone", props = "prop_roadcone02a"}},
            {label = "Barrière", value = {item = "police_barrier", props = "prop_barrier_work05"}},
        },
        select = function(_, value)
            TriggerServerEvent("job:server:placeProps", value.item, value.props)
        end,
    })
end

EmsJob.Functions.Menu.GenerateMenu = function(job, cb)
    if not EmsJob.Functions.Menu.MenuAccessIsValid(job) then
        return
    end

    --- @type Menu
    local menu = EmsJob.Menus[job].menu
    menu:ClearItems()

    cb(menu)

    if menu.IsOpen then
        MenuV:CloseAll(function()
            menu:Close()
        end)
    else
        MenuV:CloseAll(function()
            menu:Open()
        end)
    end
end

EmsJob.Functions.Menu.GenerateJobMenu = function(job)
    EmsJob.Functions.Menu.GenerateMenu(job, function(menu)
        if PlayerData.job.onduty then
            PropsEntity(menu)
        else
            menu:AddButton({label = "Tu n'es pas en service !", disabled = true})
        end
    end)
end

EmsJob.Functions.Menu.GenerateInvoiceMenu = function(job, targetPlayer)
    local player = NetworkGetPlayerIndexFromPed(targetPlayer)

    EmsJob.Functions.Menu.GenerateMenu(job, function(menu)
        menu:AddButton({
            label = "Factures personnalisée",
            value = nil,
            select = function()
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
            end,
        })

        for _, finesCategory in ipairs(Config.Fines) do
            local category = MenuV:InheritMenu(menu, {Subtitle = finesCategory.label})
            menu:AddButton({label = finesCategory.label, value = category})

            for _, fine in ipairs(finesCategory.items) do
                category:AddButton({
                    label = fine.label,
                    rightLabel = "$" .. fine.price,
                    select = function()
                        TriggerServerEvent("banking:server:sendInvoice", GetPlayerServerId(player), fine.label, fine.price)
                    end,
                })
            end
        end
    end)
end

--- Events
RegisterNetEvent("lsmc:client:OpenSocietyMenu", function()
    EmsJob.Functions.Menu.GenerateJobMenu(PlayerData.job.id)
end)

EmsJob.Functions.Menu.MenuAccessIsValid = function(job)
    if PlayerData.job.id == "lsmc" then
        return true
    end
    return false
end
