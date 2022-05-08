local shopMenu = MenuV:CreateMenu(nil, nil, "menu_shop_society", "soz", "bennys:shop:menu")

--- Targets
CreateThread(function()
    exports["qb-target"]:AddBoxZone("bennys:shop", vector3(-216.94, -1318.97, 30.89), 0.8, 1.6,
                                    {name = "bennys:shop", heading = 90, minZ = 29.89, maxZ = 32.89}, {
        options = {
            {
                label = "Récupérer du matériel",
                icon = "fas fa-briefcase",
                event = "bennts:client:weaponShop",
                canInteract = function()
                    return SozJobCore.Functions.HasPermission("bennys", SozJobCore.JobPermission.ManageGrade)
                end,
                job = "bennys",
            },
        },
        distance = 2.5,
    })
end)

--- Events
RegisterNetEvent("bennts:client:weaponShop", function()
    shopMenu:ClearItems()
    for itemID, item in pairs(Config.BossShop) do
        shopMenu:AddButton({
            label = item.amount .. "x " .. QBCore.Shared.Items[item.name].label,
            rightLabel = "$" .. item.price,
            value = itemID,
            select = function(btn)
                TriggerServerEvent("soz-bennys:server:buy", btn.Value)
            end,
        })
    end

    shopMenu:Open()
end)
