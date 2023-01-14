local drivingSchoolMenu = MenuV:CreateMenu("", "Carte grise", "menu_shop_supermarket", "soz", "driving-school:menu")

RegisterNetEvent("soz-driving-license:client:OpenMenu", function()
    local playerData = QBCore.Functions.GetPlayerData()
    if not playerData.apartment then
        return
    end

    local vehicleLimit = playerData.metadata.vehicleLimit

    drivingSchoolMenu:ClearItems()

    local priceCumul = 0
    for limit, price in pairs(Config.VehicleLimits) do
        if vehicleLimit < limit then
            priceCumul = priceCumul + math.floor(price)
            drivingSchoolMenu:AddButton({
                label = "Niveau " .. limit,
                value = {limit = limit, price = priceCumul},
                rightLabel = "$" .. QBCore.Shared.GroupDigits(priceCumul),
                select = function(data)
                    local value = data.Value
                    TriggerServerEvent("soz-driving-license:server:UpdateVehicleLimit", value.limit, value.price)
                    drivingSchoolMenu:Close()
                end,
            })
        else
            local label = "Acquis"
            if vehicleLimit == limit then
                label = "Actuel"
            end

            drivingSchoolMenu:AddButton({label = "Niveau " .. limit, rightLabel = label})
        end
    end

    drivingSchoolMenu:Open()
end)
