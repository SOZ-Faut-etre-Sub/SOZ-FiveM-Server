local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_pawl", "soz", "pawl:menu")

local displayBlips, Blips = false, {}

RegisterNetEvent("pawl:client:OpenSocietyMenu", function()
    societyMenu:ClearItems()

    if PlayerData.job.onduty then
        societyMenu:AddCheckbox({
            label = "Afficher la zone de récolte sur le GPS",
            value = displayBlips,
            change = function(_, value)
                displayBlips = value
                for identifier, data in pairs(Config.Fields) do
                    if data.blip then
                        local zoneName = "pawl_farm:" .. identifier

                        if not Blips[zoneName] then
                            local blip = AddBlipForRadius(data.blip.Coords, data.blip.Radius)
                            SetBlipSprite(blip, 9)
                            SetBlipColour(blip, 0)

                            Blips[zoneName] = blip
                        end

                        SetBlipAlpha(Blips[zoneName], value and 128 or 0)
                    end
                end
            end,
        })
    else
        societyMenu:AddButton({label = "Tu n'es pas en service !", disabled = true})
    end

    if societyMenu.IsOpen then
        societyMenu:Close()
    else
        societyMenu:Open()
    end
end)

RegisterNetEvent("pawl:client:OpenCloakroomMenu", function()
    societyMenu:ClearItems()

    societyMenu:AddButton({
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

    for name, skin in pairs(Config.Cloakroom[PlayerData.skin.Model.Hash]) do
        societyMenu:AddButton({
            label = name,
            value = nil,
            select = function()
                QBCore.Functions.Progressbar("switch_clothes", "Changement d'habits...", 5000, false, true, {
                    disableMovement = true,
                    disableCombat = true,
                }, {animDict = "anim@mp_yacht@shower@male@", anim = "male_shower_towel_dry_to_get_dressed", flags = 16}, {}, {}, function() -- Done
                    TriggerServerEvent("soz-character:server:SetPlayerJobClothes", skin)
                end)
            end,
        })
    end

    societyMenu:Open()
end)
