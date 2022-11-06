local houseMenu = MenuV:CreateMenu(nil, "Les habitations !", "menu_habitation", "soz", "housing:menu")

Housing.Functions = {}

--- Setups Properties

--- @param property Property
Housing.Functions.SetupBlips = function(property)
    local blipCategory = property:IsBuilding() and "building" or "house"
    local blipType = property:HasRentedApartmentForCitizenId(PlayerData.citizenid) and "owned" or "free"
    local entryZone = property:GetEntryZone()

    QBCore.Functions.RemoveBlip(property.identifier)

    if (HousingMap and property:HasAvailableApartment()) or property:HasRentedApartmentForCitizenId(PlayerData.citizenid) then
        QBCore.Functions.CreateBlip(property.identifier, {
            name = "Habitation",
            coords = vector3(entryZone.x, entryZone.y, entryZone.z),
            sprite = Config.Blips[blipCategory][blipType],
            scale = blipType == "owned" and 0.8 or 0.5,
        })
    end
end

--- Other functions
Housing.Functions.IsInsideApartment = function()
    return PlayerData.metadata["inside"].apartment ~= false
end

Housing.Functions.GenerateMenu = function(cb)
    houseMenu:ClearItems()

    cb(houseMenu)

    if houseMenu.IsOpen then
        MenuV:CloseAll(function()
            houseMenu:Close()
        end)
    else
        MenuV:CloseAll(function()
            houseMenu:Open()
        end)
    end
end

Housing.Functions.Teleport = function(title, coords)
    QBCore.Functions.Progressbar("housing_action", title, 1000, false, false,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {animDict = "mp_doorbell", anim = "ring_bell_b", flags = 16}, {}, {}, function()
        local ped = PlayerPedId()

        DoScreenFadeOut(500)
        Citizen.Wait(500)

        SetPedCoordsKeepVehicle(ped, coords.x, coords.y, coords.z)
        SetEntityHeading(ped, coords.w or 0)

        DoScreenFadeIn(500)
    end)
end

Housing.Functions.TargetInteraction = function(name, config, interactions)
    if not config then
        return
    end
    exports["qb-target"]:RemoveZone(name)
    exports["qb-target"]:AddBoxZone(name, vector3(config.x, config.y, config.z), config.sx, config.sy,
                                    {
        name = name,
        heading = config.heading,
        minZ = config.minZ,
        maxZ = config.maxZ,
        debugPoly = true,
    }, {options = interactions, distance = 2.5})
end
