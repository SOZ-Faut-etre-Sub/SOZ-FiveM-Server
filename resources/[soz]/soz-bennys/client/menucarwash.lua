local VehiculeWash = MenuV:CreateMenu(nil, "Station lavage", "menu_job_depanneur", "soz", "mechanic:vehicle:wash")
local insidewash = false

VehiculeWash:On("open", function(menu)
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Fermer menu",
        select = function()
            menu:Close()
        end,
    })
    menu:AddButton({
        label = "Lavage",
        description = "Laver le véhicule",
        select = function()
            menu:Close()
            TriggerEvent("qb-carwash:client:washCar")
        end,
    })
end)

Washmecha = BoxZone:Create(vector3(-198.28, -1324.56, 30.89), 8, 6, {
    name = "Washmecha_z",
    heading = 90,
    minZ = 29.89,
    maxZ = 33.89,
})

Washmecha:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
    if isPointInside then
        if OnDuty == true and PlayerJob.id == "bennys" then
            if IsPedInAnyVehicle(PlayerPedId()) then
                local veh = GetVehiclePedIsIn(PlayerPedId())
                if not IsThisModelABicycle(GetEntityModel(veh)) then
                    insidewash = true
                else
                    exports["soz-hud"]:DrawNotification("Vous ne pouvez pas mette de vélos", "error")
                end
            end
        end
    else
        if OnDuty == true and PlayerJob.id == "bennys" then
            insidewash = false
        end
    end
end)

CreateThread(function()
    exports["qb-target"]:AddGlobalVehicle({
        options = {
            {
                type = "client",
                icon = "c:mechanic/Car_wash.png",
                label = "Carwash",
                action = function(entity)
                    VehiculeWash:Open()
                end,
                canInteract = function(entity, distance, data)
                    return insidewash
                end,
            },
        },
        distance = 3.0,
    })
end)
