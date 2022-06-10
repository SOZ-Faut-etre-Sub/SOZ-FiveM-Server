RegisterNetEvent("housing:client:ShowEnterMenu", function(propertyId)
    local property = Properties[propertyId]
    local apartments = property:GetRentedApartments(PlayerData.citizenid)

    if not property:IsBuilding() then
        for apartmentId, _ in pairs(apartments) do
            TriggerServerEvent("housing:server:EnterProperty", propertyId, apartmentId)
            return
        end
    end

    Housing.Functions.GenerateMenu(function(menu)
        for apartmentId, apartment in pairs(apartments) do
            menu:AddButton({
                label = apartment.label,
                select = function()
                    TriggerServerEvent("housing:server:EnterProperty", propertyId, apartmentId)
                    menu:Close()
                end,
            })
        end
    end)
end)

RegisterNetEvent("housing:client:ShowBuyMenu", function(propertyId)
    local property = Properties[propertyId]
    local apartments = property:GetAvailableApartments()

    Housing.Functions.GenerateMenu(function(menu)
        for apartmentId, apartment in pairs(apartments) do
            menu:AddButton({
                label = apartment.label,
                rightLabel = "$" .. QBCore.Shared.Round(apartment:GetPrice()),
                select = function()
                    TriggerServerEvent("housing:server:BuyProperty", propertyId, apartmentId)
                    menu:Close()
                end,
            })
        end
    end)
end)

RegisterNetEvent("housing:client:ShowSellMenu", function(propertyId)
    local property = Properties[propertyId]
    local apartments = property:GetApartments()

    Housing.Functions.GenerateMenu(function(menu)
        for apartmentId, apartment in pairs(apartments) do
            menu:AddButton({
                label = apartment.label,
                rightLabel = "$" .. QBCore.Shared.Round(apartment:GetResellPrice()),
                select = function()
                    TriggerServerEvent("housing:server:SellProperty", propertyId, apartmentId)
                    menu:Close()
                end,
            })
        end
    end)
end)

RegisterNetEvent("housing:client:ShowInspectMenu", function(propertyId)
    local property = Properties[propertyId]
    local apartments = property:GetAvailableApartments()

    if not property:IsBuilding() then
        for apartmentId, _ in pairs(apartments) do
            TriggerServerEvent("housing:server:InspectProperty", propertyId, apartmentId)
            return
        end
    end

    Housing.Functions.GenerateMenu(function(menu)
        for apartmentId, apartment in pairs(apartments) do
            menu:AddButton({
                label = apartment.label,
                select = function()
                    TriggerServerEvent("housing:server:InspectProperty", propertyId, apartmentId)
                    menu:Close()
                end,
            })
        end
    end)
end)
