local VehiculeWash = MenuV:CreateMenu(nil, "Station lavage", "menu_shop_vehicle_car", "soz", "mechanic:vehicle:wash")
local insidewash = false

local function WashMenu(menu)
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
end

local function GenerateWashMenu()
    if VehiculeWash.IsOpen then
        VehiculeWash:Close()
    else
        VehiculeWash:ClearItems()
        WashMenu(VehiculeWash)
        VehiculeWash:Open()
    end
end

Washmecha = BoxZone:Create(vector3(-198.92, -1324.4, 30.89), 8, 6, {
    name = "Washmecha_z",
    heading = 270,
    minZ = 29.89,
    maxZ = 33.89,
})

Washmecha:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
    if isPointInside then
        if OnDuty == false and PlayerJob.id == "bennys" then
            if IsPedInAnyVehicle(PlayerPedId()) then
                local veh = GetVehiclePedIsIn(PlayerPedId())
                if not IsThisModelABicycle(GetEntityModel(veh)) then
                    insidewash = true
                else
                    exports["soz-hud"]:DrawNotification("~r~Vous ne pouvez pas mette de vélos")
                end
            end
        end
    else
        if OnDuty == false and PlayerJob.id == "bennys" then
            insidewash = false
            VehiculeWash:Close()
        end
    end
end)

CreateThread(function()
    while true do
        if insidewash == true then
            QBCore.Functions.ShowHelpNotification("~INPUT_CONTEXT~ Menu de lavage")
            if IsControlJustPressed(1, 51) then
                GenerateWashMenu()
            end
        end
        Wait(2)
    end
end)

