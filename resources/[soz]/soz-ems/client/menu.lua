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
        values = {{label = "Cone de circulation", value = {item = "cone", props = "prop_roadcone02a"}}},
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
        if menu.IsOpen then
            menu:Close()
            return
        end
        if PlayerData.job.onduty then
            PropsEntity(menu)
        else
            menu:AddButton({label = "Tu n'es pas en service !", disabled = true})
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
