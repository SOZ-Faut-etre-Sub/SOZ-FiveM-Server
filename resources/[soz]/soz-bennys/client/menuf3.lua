local BennysF3 = MenuV:CreateMenu(nil, "Services Bennys", "menu_job_bennys", "soz", "bennys:menu:f3")

local function OpenF3Menu(menu)
    if OnDuty then
        menu:AddSlider({
            icon = "🚧",
            label = "Poser un objet",
            value = nil,
            values = {
                {label = "Cone de circulation", value = {item = "cone", props = "prop_roadcone02a"}},
                {label = "Barrière", value = {item = "police_barrier", props = "prop_barrier_work05"}},
            },
            select = function(_, value)
                TriggerServerEvent("job:server:placeProps", value.item, value.props)
            end,
        })
    else
        menu:AddButton({label = "Tu n'es pas en service !", disabled = true})
    end
end

local function GenerateF3Menu()
    if BennysF3.IsOpen then
        BennysF3:Close()
    else
        BennysF3:ClearItems()
        OpenF3Menu(BennysF3)
        BennysF3:Open()
    end
end

RegisterNetEvent("bennys:client:OpenSocietyMenu", function()
    GenerateF3Menu()
end)
