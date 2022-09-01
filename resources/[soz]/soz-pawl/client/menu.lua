local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_pawl", "soz", "pawl:menu")

local displayBlips, displayResellBlip, Blips = false, false, {}

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    if not duty then
        QBCore.Functions.HideBlip("pawl_resell", true)
    end
end)

RegisterNetEvent("pawl:client:OpenSocietyMenu", function()
    societyMenu:ClearItems()

    if PlayerData.job.onduty then
        societyMenu:AddCheckbox({
            label = "Afficher la zone de récolte sur le GPS",
            value = displayBlips,
            change = function(_, value)
                displayBlips = value
                for identifier, data in pairs(Config.Blip.Fields) do
                    if data then
                        local zoneName = "pawl_farm:" .. identifier

                        if not Blips[zoneName] then
                            local blip = AddBlipForRadius(data.Coords, data.Radius)
                            SetBlipSprite(blip, 9)
                            SetBlipColour(blip, 0)

                            Blips[zoneName] = blip
                        end

                        SetBlipAlpha(Blips[zoneName], value and 128 or 0)
                    end
                end
            end,
        })

        societyMenu:AddCheckbox({
            label = "Afficher la zone de revente sur le GPS",
            value = displayResellBlip,
            change = function(_, value)
                displayResellBlip = value

                if not QBCore.Functions.GetBlip("pawl_resell") then
                    QBCore.Functions.CreateBlip("pawl_resell", {
                        name = "Zone de rente",
                        coords = SozJobCore.Jobs[SozJobCore.JobType.Pawl].resell.primary.coords,
                        sprite = Config.Blip.Sprite,
                        scale = 0.8,
                    })
                end

                QBCore.Functions.HideBlip("pawl_resell", not value)
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
