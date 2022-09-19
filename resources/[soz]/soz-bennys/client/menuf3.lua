local BennysF3 = MenuV:CreateMenu(nil, "Services Bennys", "menu_job_bennys", "soz", "bennys:menu:f3")

BennysF3:On("open", function(menu)
    menu:ClearItems()
    if OnDuty then
        menu:AddSlider({
            icon = "🚧",
            label = "Poser un objet",
            value = nil,
            values = {{label = "Cone de circulation", value = {item = "cone", props = "prop_roadcone02a"}}},
            select = function(_, value)
                TriggerServerEvent("job:server:placeProps", value.item, value.props)
            end,
        })
    else
        menu:AddButton({label = "Tu n'es pas en service !", disabled = true})
    end
end)

RegisterNetEvent("bennys:client:OpenSocietyMenu", function()
    if BennysF3.IsOpen then
        BennysF3:Close()
        return
    end

    BennysF3:Open()
end)
