RegisterNetEvent("housing:client:ShowEnterMenu", function(propertyId)
    local property = Properties[propertyId]
    local apartments = property:GetRentedApartmentsForCitizenId(PlayerData.citizenid)

    if not property:IsBuilding() then
        for apartmentId, _ in pairs(apartments) do
            TriggerServerEvent("housing:server:EnterApartment", propertyId, apartmentId)
            return
        end
    end

    Housing.Functions.GenerateMenu(function(menu)
        for apartmentId, apartment in pairs(apartments) do
            menu:AddButton({
                label = apartment:GetLabel(),
                select = function()
                    TriggerServerEvent("housing:server:EnterApartment", propertyId, apartmentId)
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
                label = apartment:GetLabel(),
                rightLabel = "$" .. QBCore.Shared.Round(apartment:GetPrice()),
                select = function()
                    TriggerServerEvent("housing:server:BuyApartment", propertyId, apartmentId)
                    menu:Close()
                end,
            })
        end
    end)
end)

RegisterNetEvent("housing:client:ShowSellMenu", function(propertyId)
    local property = Properties[propertyId]
    local apartments = property:GetOwnedApartmentsForCitizenId(PlayerData.citizenid)

    Housing.Functions.GenerateMenu(function(menu)
        for apartmentId, apartment in pairs(apartments) do
            menu:AddButton({
                label = apartment:GetLabel(),
                rightLabel = "$" .. QBCore.Shared.Round(apartment:GetResellPrice()),
                select = function()
                    TriggerServerEvent("housing:server:SellApartment", propertyId, apartmentId)
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
            TriggerServerEvent("housing:server:InspectApartment", propertyId, apartmentId)
            return
        end
    end

    Housing.Functions.GenerateMenu(function(menu)
        for apartmentId, apartment in pairs(apartments) do
            menu:AddButton({
                label = apartment:GetLabel(),
                select = function()
                    TriggerServerEvent("housing:server:InspectApartment", propertyId, apartmentId)
                    menu:Close()
                end,
            })
        end
    end)
end)

RegisterNetEvent("housing:client:ShowBellMenu", function(propertyId)
    local property = Properties[propertyId]
    local apartments = property:GetRentedApartmentsBesidesForCitizenId(PlayerData.citizenid)

    if not property:IsBuilding() then
        for apartmentId, _ in pairs(apartments) do
            TriggerServerEvent("housing:server:BellProperty", propertyId, apartmentId)
            return
        end
    end

    Housing.Functions.GenerateMenu(function(menu)
        for apartmentId, apartment in pairs(apartments) do
            menu:AddButton({
                label = apartment:GetLabel(),
                select = function()
                    TriggerServerEvent("housing:server:BellProperty", propertyId, apartmentId)
                    menu:Close()
                end,
            })
        end
    end)
end)

AddEventHandler("housing:client:ShowGarageMenu", function(propertyId)
    local property = Properties[propertyId]
    if property then
        TriggerEvent("soz-core:client:vehicle:garage:house:open-menu", property:GetIdentifier())
    end
end)

AddEventHandler("housing:client:GarageStoreVehicle", function(propertyId)
    local property = Properties[propertyId]
    if property then
        TriggerEvent("soz-core:client:vehicle:garage:house:store", property:GetIdentifier())
    end
end)

RegisterNetEvent("housing:client:ShowAddRoommateMenu", function(propertyId)
    local property = Properties[propertyId]
    local apartments = property:GetOwnedApartmentsForCitizenId(PlayerData.citizenid)

    local player, distance = QBCore.Functions.GetClosestPlayer()
    if player == -1 or distance > 2.0 then
        exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
        return
    end

    if not property:IsBuilding() then
        for apartmentId, apartment in pairs(apartments) do
            if not apartment:HasRoommate() then
                TriggerServerEvent("housing:server:AddRoommateApartment", propertyId, apartmentId, GetPlayerServerId(player))
                return
            end
        end
    end

    Housing.Functions.GenerateMenu(function(menu)
        for apartmentId, apartment in pairs(apartments) do
            if not apartment:HasRoommate() then
                menu:AddButton({
                    label = apartment:GetLabel(),
                    select = function()
                        local player, distance = QBCore.Functions.GetClosestPlayer()
                        if player == -1 or distance > 2.0 then
                            exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
                            return
                        end

                        TriggerServerEvent("housing:server:AddRoommateApartment", propertyId, apartmentId, GetPlayerServerId(player))
                        menu:Close()
                    end,
                })
            end
        end
    end)
end)

RegisterNetEvent("housing:client:ShowRemoveRoommateMenu", function(propertyId)
    local property = Properties[propertyId]
    local apartments = property:GetOwnedApartmentsForCitizenId(PlayerData.citizenid)

    if not property:IsBuilding() then
        for apartmentId, apartment in pairs(apartments) do
            if apartment:HasRoommate() then
                TriggerServerEvent("housing:server:RemoveRoommateApartment", propertyId, apartmentId)
                return
            end
        end
    end

    Housing.Functions.GenerateMenu(function(menu)
        for apartmentId, apartment in pairs(apartments) do
            if apartment:HasRoommate() then
                menu:AddButton({
                    label = apartment:GetLabel(),
                    select = function()
                        TriggerServerEvent("housing:server:RemoveRoommateApartment", propertyId, apartmentId)
                        menu:Close()
                    end,
                })
            end
        end
    end)
end)

RegisterNetEvent("housing:client:QuitColocation", function(propertyId)
    local property = Properties[propertyId]
    local apartmentId, apartment = property:GetApartmentAsRoommate(PlayerData.citizenid)

    if apartmentId ~= nil then
        TriggerServerEvent("housing:server:RemoveRoommateApartment", propertyId, apartmentId)
    end
end)

