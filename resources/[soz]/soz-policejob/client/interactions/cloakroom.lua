RegisterNetEvent("police:client:OpenCloakroomMenu", function(storageId)
    PoliceJob.Functions.Menu.GenerateMenu(PlayerData.job.id, function(menu)
        menu:AddButton({
            label = "Tenue de service",
            value = nil,
            select = function()
                if storageId then
                    TriggerServerEvent("soz-core:server:job:use-work-clothes", storageId)
                end
                TriggerEvent("police:client:applyDutyClothing", PlayerData.job.id)
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
                    TriggerServerEvent("soz-character:server:SetPlayerJobClothes", nil, false)
                end)
            end,
        })

        table.sort(Config.Cloakroom[PlayerData.job.id][PlayerData.skin.Model.Hash])
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
                        if storageId then
                            TriggerServerEvent("soz-core:server:job:use-work-clothes", storageId)
                        end
                        TriggerServerEvent("soz-character:server:SetPlayerJobClothes", skin)
                    end)
                end,
            })
        end
    end)
end)

RegisterNetEvent("police:client:SetPrisonerClothes", function()
    local playerPed = PlayerPedId()
    local playerPedModel = GetEntityModel(playerPed)

    if not LocalPlayer.state.havePrisonerClothes then
        QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
            disableMovement = true,
            disableCombat = true,
        }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
            TriggerServerEvent("soz-character:server:SetPlayerJobClothes", Config.PrisonerClothes[playerPedModel])
            LocalPlayer.state:set("havePrisonerClothes", true, true)
        end)
    else
        QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
            disableMovement = true,
            disableCombat = true,
        }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
            TriggerServerEvent("soz-character:server:SetPlayerJobClothes", nil)
            LocalPlayer.state:set("havePrisonerClothes", false, true)
        end)
    end
end)
