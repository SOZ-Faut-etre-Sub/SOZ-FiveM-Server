local BennysF3 = MenuV:CreateMenu(nil, "Services Bennys", "menu_job_bennys", "soz", "bennys:menu:f3")

local function OpenMenu2(menu)
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
end

local function OpenMenu(menu)
    local veh = GetVehiclePedIsIn(PlayerPedId(), false)
    FreezeEntityPosition(veh, true)
    menu:AddButton({
        label = "Réparation du véhicule",
        description = "Réparer les pièces du véhicule",
        select = function()
            OpenPartsMenu(Status)
        end,
    })
    menu:AddButton({
        label = "Customisation du véhicule",
        description = "Changer les composants du véhicule",
        select = function()
            SetVehicleModKit(veh, 0)
            OpenCustom(VehiculeCustom)
        end,
    })
end

local function GenerateF3Menu()
    if BennysF3.IsOpen then
        BennysF3:Close()
    else
        BennysF3:ClearItems()
        OpenMenu(BennysF3)
        BennysF3:Open()
    end
end

RegisterNetEvent("lsmc:client:OpenSocietyMenu", function()
    GenerateF3Menu()
end)
