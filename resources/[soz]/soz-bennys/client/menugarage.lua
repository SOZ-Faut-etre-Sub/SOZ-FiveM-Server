local VehicleList = MenuV:CreateMenu(nil, "Vehicle List", "menu_shop_vehicle_car", "soz", "mechanic:vehicle:list")
local insidespawn = false

local function OpenListMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Fermer menu",
        select = function()
            menu:Close()
        end,
    })
    for k, v in pairs(Config.Vehicles) do
        menu:AddButton({
            label = v,
            description = "Emprunter le " .. v .. "",
            select = function()
                menu:Close()
                TriggerEvent("soz-bennys:client:SpawnListVehicle", k)
            end,
        })
    end
end

local function GenerateOpenListMenu()
    if VehicleList.IsOpen then
        VehicleList:Close()
    else
        VehicleList:ClearItems()
        OpenListMenu(VehicleList)
        VehicleList:Open()
    end
end

Vehiclespawn = BoxZone:Create(vector3(-163.47, -1301.73, 31.3), 20, 18, {
    name = "Vehiclespawn_z",
    heading = 90,
    minZ = 30.3,
    maxZ = 34.3,
})

Vehiclespawn:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
    if isPointInside then
        if OnDuty then
            insidespawn = true
        end
    else
        insidespawn = false
        VehicleList:Close()
    end
end)

CreateThread(function()
    while true do
        if insidespawn == true then
            if IsPedInAnyVehicle(PlayerPedId()) then
                QBCore.Functions.ShowHelpNotification("~INPUT_CONTEXT~ Ranger le véhicule")
                if IsControlJustPressed(1, 51) then
                    DeleteVehicle(GetVehiclePedIsIn(PlayerPedId()))
                end
            else
                QBCore.Functions.ShowHelpNotification("~INPUT_CONTEXT~ Garage de véhicule")
                if IsControlJustPressed(1, 51) then
                    GenerateOpenListMenu()
                end
            end
        end
        Wait(2)
    end
end)
