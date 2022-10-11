local BennysCloak = MenuV:CreateMenu(nil, "Vestiaire Bennys", "menu_job_bennys", "soz", "bennys:menu:cloak")

-- Not the best workaround I've done but that should do it until the rework.
local storageId = nil

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
                TriggerServerEvent("soz-character:server:SetPlayerJobClothes", nil)
            end)
        end,
    })

    local gradename = QBCore.Functions.TriggerRpc("soz-bennys:server:CloakroomTenues", PlayerData.job.grade)
    for name, skin in pairs(Config.Cloakroom[gradename.name][PlayerData.skin.Model.Hash]) do
        menu:AddButton({
            label = name,
            value = nil,
            select = function()
                QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
                    disableMovement = true,
                    disableCombat = true,
                }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
                    if storageId then
                        TriggerServerEvent("soz-core:server:job:use-work-clothes", storageId)
                    end
                    TriggerServerEvent("soz-character:server:SetPlayerJobClothes", skin)
                end)
            end,
        })
    end
end)

RegisterNetEvent("soz-bennys:client:OpenCloakroomMenu", function(storageIdToSave)
    storageId = storageIdToSave
    BennysCloak:Open()
end)
