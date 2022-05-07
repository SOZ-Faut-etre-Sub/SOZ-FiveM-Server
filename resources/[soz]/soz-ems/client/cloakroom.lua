RegisterNetEvent("lsmc:client:OpenCloakroomMenu", function()
    EmsJob.Functions.Menu.GenerateMenu(PlayerData.job.id, function(menu)
        menu:AddButton({
            label = "Tenue de service",
            value = nil,
            select = function()
                TriggerEvent("ems:client:applyDutyClothing", PlayerData.job.id)
            end,
        })

        menu:AddButton({
            label = "Tenue civile",
            value = nil,
            select = function()
                QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
                    disableMovement = true,
                    disableCombat = true,
                }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
                    TriggerServerEvent("soz-character:server:SetPlayerJobClothes", nil)
                end)
            end,
        })

        for name, skin in pairs(Config.Cloakroom[PlayerData.job.id][PlayerData.skin.Model.Hash]) do
            menu:AddButton({
                label = name,
                value = nil,
                select = function()
                    QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
                        disableMovement = true,
                        disableCombat = true,
                    }, {
                        animDict = "anim@mp_yacht@shower@male@",
                        anim = "male_shower_towel_dry_to_get_dressed",
                        flags = 16,
                    }, {}, {}, function() -- Done
                        TriggerServerEvent("soz-character:server:SetPlayerJobClothes", skin)
                    end)
                end,
            })
        end
    end)
end)

--- Duty clothings
RegisterNetEvent("ems:client:applyDutyClothing", function(clotheType)
    local clothesConfig = {Components = {}, Props = {}}

    for grade, clothes in pairs(Config.DutyOutfit[clotheType]) do
        if tonumber(grade) == 0 or tonumber(grade) == tonumber(PlayerData.job.grade) then
            for id, component in pairs(clothes[PlayerData.skin.Model.Hash].Components) do
                clothesConfig.Components[id] = component
            end
            for id, prop in pairs(clothes[PlayerData.skin.Model.Hash].Props) do
                clothesConfig.Props[id] = prop
            end
        end
    end

    QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
        disableMovement = true,
        disableCombat = true,
    }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
        TriggerServerEvent("soz-character:server:SetPlayerJobClothes", clothesConfig)
    end)
end)
