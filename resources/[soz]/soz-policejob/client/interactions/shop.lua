--- Targets
CreateThread(function()
    local shopOptions = {
        {
            label = "Récupérer du matériel",
            icon = "fas fa-briefcase",
            event = "police:client:weaponShop",
            canInteract = function()
                return SozJobCore.Functions.HasPermission(SozJobCore.JobPermission.ManageGrade)
            end,
        },
    }

    exports["qb-target"]:AddBoxZone("lspd:shop", vector3(620.64, -26.33, 90.51), 4.0, 0.8, {
        name = "lspd:shop",
        heading = 340,
        minZ = 89.5,
        maxZ = 92.5,
    }, {options = shopOptions, distance = 2.5})

    exports["qb-target"]:AddBoxZone("bcso:shop", vector3(1858.9, 3689.47, 38.07), 0.6, 0.6, {
        name = "bcso:shop",
        heading = 30,
        minZ = 37,
        maxZ = 39,
    }, {options = shopOptions, distance = 2.5})
end)

--- Events
RegisterNetEvent("police:client:weaponShop", function()
    PoliceJob.Functions.Menu.GenerateMenu(PlayerData.job.id, function(menu)
        local items = Config.WeaponShop[PlayerData.job.id]
        if not items then
            return
        end

        for weaponID, weapon in ipairs(items) do
            menu:AddButton({
                label = weapon.amount .. "x " .. QBCore.Shared.Items[weapon.name].label,
                rightLabel = "$" .. weapon.price,
                value = weaponID,
                select = function(btn)
                    TriggerServerEvent("police:server:buy", btn.Value)
                end,
            })
        end
    end)
end)
