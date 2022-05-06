local BennysCloak = MenuV:CreateMenu(nil, "Vestiaire Bennys", "menu_job_bennys", "soz", "bennys:menu:cloak")

BennysCloak:On("open", function(menu)
    menu:ClearItems()
    menu:AddButton({
        label = "Tenue civile",
        value = nil,
        select = function()
            QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
                disableMovement = true,
                disableCombat = true,
            }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
                TriggerEvent("soz-character:Client:ApplyCurrentClothConfig")
            end)
        end,
    })

    for name, skin in pairs(Config.Cloakroom[PlayerJob.id][PlayerData.skin.Model.Hash]) do
        menu:AddButton({
            label = name,
            value = nil,
            select = function()
                QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
                    disableMovement = true,
                    disableCombat = true,
                }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
                    TriggerEvent("soz-character:Client:ApplyTemporaryClothSet", skin)
                end)
            end,
        })
    end
end)

RegisterNetEvent("soz-bennys:client:OpenCloakroomMenu", function()
    BennysCloak:Open()
end)
