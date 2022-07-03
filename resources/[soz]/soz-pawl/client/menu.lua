local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_fueler", "soz", "pawl:menu")

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
