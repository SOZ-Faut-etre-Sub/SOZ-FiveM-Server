local shopMenu = MenuV:CreateMenu(nil, nil, "menu_shop_society", "soz", "ems:shop:menu")

--- Targets
CreateThread(function()
    local shopOptions = function(job)
        return {
            {
                label = "Récupérer du matériel",
                icon = "fas fa-briefcase",
                event = "ems:client:weaponShop",
                canInteract = function()
                    return SozJobCore.Functions.HasPermission(job, SozJobCore.JobPermission.ManageGrade)
                end,
                job = job,
            },
        }
    end

    exports["qb-target"]:AddBoxZone("lsmc:shop", vector3(309.79, -1417.49, 32.51), 0.6, 1.25, {
        name = "lsmc:shop",
        heading = 50,
        minZ = 31.51,
        maxZ = 32.51,
    }, {options = shopOptions("lsmc"), distance = 2.5})
end)

--- Events
RegisterNetEvent("ems:client:weaponShop", function()
    if not EmsJob.Functions.Menu.MenuAccessIsValid(PlayerData.job.id) then
        return
    end

    local items = Config.BossShop[PlayerData.job.id]
    if not items then
        return
    end

    shopMenu:ClearItems()
    for itemID, item in pairs(items) do
        shopMenu:AddButton({
            label = item.amount .. "x " .. QBCore.Shared.Items[item.name].label,
            rightLabel = "$" .. item.price,
            value = itemID,
            select = function(btn)
                TriggerServerEvent("ems:server:buy", btn.Value)
            end,
        })
    end

    shopMenu:Open()
end)
