TaxiJob.Functions = {}
TaxiJob.Functions.Menu = {}
TaxiJob.Menus = {}

CreateThread(function()
    TaxiJob.Menus["taxi"] = {menu = MenuV:CreateMenu(nil, "Le transport !", "menu_job_trucker", "soz", "taxi:menu")}
end)

TaxiJob.Functions.Menu.GenerateMenu = function(job, cb)
    if not TaxiJob.Functions.Menu.MenuAccessIsValid(job) then
        return
    end

    --- @type Menu
    local menu = TaxiJob.Menus[job].menu
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

TaxiJob.Functions.Menu.GenerateJobMenu = function(job)
    TaxiJob.Functions.Menu.GenerateMenu(job, function(menu)
        if menu.IsOpen then
            menu:Close()
            return
        end
        if PlayerData.job.onduty then
            menu:AddButton({
                label = "Afficher Horodateur",
                value = nil,
                select = function()
                    TriggerEvent("taxi:client:toggleHorodateur")
                end,
            })
            menu:AddButton({
                label = "Activer Horodateur",
                value = nil,
                select = function()
                    TriggerEvent("taxi:client:enableHorodateur")
                end,
            })
            if not NpcData.Active then
                menu:AddButton({
                    label = "Prendre une mission",
                    value = nil,
                    select = function()
                        TriggerEvent("taxi:client:DoTaxiNpc")
                    end,
                })
            else
                menu:AddButton({
                    label = "Annuler la mission",
                    value = nil,
                    select = function()
                        exports["soz-hud"]:DrawNotification("Vous avez annulé la mission")
                        ClearNpcMission()
                    end,
                })
            end
        else
            menu:AddButton({label = "Tu n'es pas en service !", disabled = true})
        end
    end)
end

--- Events
RegisterNetEvent("taxi:client:OpenSocietyMenu", function()
    TaxiJob.Functions.Menu.GenerateJobMenu(PlayerData.job.id)
end)

TaxiJob.Functions.Menu.MenuAccessIsValid = function(job)
    if PlayerData.job.id == "taxi" then
        return true
    end
    return false
end
