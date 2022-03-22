--- Targets
CreateThread(function()
    exports["qb-target"]:SpawnPed({
        {
            model = "s_m_y_cop_01",
            coords = vector4(447.24, -973.32, 30.18, 217.04),
            minusOne = true,
            freeze = true,
            invincible = true,
            blockevents = true,
            scenario = "PROP_HUMAN_SEAT_CHAIR_UPRIGHT",
            target = {
                options = {
                    {
                        label = "Récupérer du matériel LSPD",
                        icon = "fas fa-briefcase",
                        event = "police:client:weaponShop",
                        canInteract = function()
                            return SozJobCore.Functions.HasPermission(SozJobCore.JobPermission.ManageGrade)
                        end,
                    },
                },
                distance = 5.0,
            },
        },
    })
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
