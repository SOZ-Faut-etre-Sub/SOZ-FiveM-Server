Dealership = {}

local function generateCatalog(dealershipKey)
    local catalog = {}
    -- Map of the categories key to lua index so that we can sort the catalog later
    local keyToIndex = {}

    local vehicles = QBCore.Functions.TriggerRpc("soz-vehicle:server:GetVehiclesOfDealership", dealershipKey)
    for _, vehicle in pairs(vehicles) do
        if Config.CategoryTypes[vehicle.category] ~= nil then
            if keyToIndex[vehicle.category] == nil then
                keyToIndex[vehicle.category] = #catalog + 1
            end
            local categoryIndex = keyToIndex[vehicle.category]
            if catalog[categoryIndex] == nil then
                catalog[categoryIndex] = {
                    key = vehicle.category,
                    name = Config.CategoryTypes[vehicle.category],
                    vehicles = {},
                }
            end
            local index = #catalog[categoryIndex].vehicles + 1
            catalog[categoryIndex].vehicles[index] = vehicle
        end
    end
    for _, category in pairs(catalog) do
        table.sort(category.vehicles, function(vehicleA, vehicleB)
            return vehicleA.price < vehicleB.price
        end)
    end
    table.sort(catalog, function(categoryA, categoryB)
        return categoryA.name < categoryB.name
    end)
    return catalog
end

local function createMenu(subtitle, namespace)
    return MenuV:CreateMenu(nil, subtitle, "menu_shop_vehicle_car", "soz", namespace)
end

function Dealership:SpawnPed()
    exports["qb-target"]:SpawnPed({
        {
            model = self.ped.model,
            coords = self.ped.coords,
            minusOne = false,
            freeze = true,
            invincible = true,
            blockevents = true,
            animDict = "abigail_mcs_1_concat-0",
            anim = "csb_abigail_dual-0",
            flag = 1,
            scenario = "WORLD_HUMAN_CLIPBOARD",
        },
    })
end

function Dealership:new(key, config)
    self.__index = self
    local menu = createMenu("Veuillez choisir un véhicule", "shop:vehicle:" .. key)
    local confirmMenu = MenuV:InheritMenu(menu)

    local dealership = setmetatable({
        key = key,
        active = config.active,
        categories = config.categories,
        licence = config.licence,
        catalog = generateCatalog(key),
        vehicle = config.vehicle,
        ped = config.ped,
        menu = menu,
        confirmMenu = confirmMenu,
        isInside = false,
    }, self)

    menu:On("open", function()
        dealership:SetupCam()
    end)

    menu:On("close", function()
        dealership:CleanVehicleSpawn()
        dealership:DeleteCam()
    end)

    return dealership
end

function Dealership:SetInside(value)
    self.isInside = value
end

function Dealership:Destroy()
    self.menu:Close()
    MenuV:DeleteNamespace(namespace)
end

function Dealership:SetupCam()
    local spawn = self.vehicle.spawn
    local camera = self.vehicle.camera
    local cam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", camera.x, camera.y, camera.z, 0.0, 0.0, 0.0, 60.0, false, 0)
    PointCamAtCoord(cam, spawn.x, spawn.y, spawn.z)
    SetCamActive(cam, true)
    RenderScriptCams(true, true, 1, true, true)
end

function Dealership:DeleteCam()
    RenderScriptCams(false)
    DestroyAllCams(true)
    SetFocusEntity(GetPlayerPed(PlayerId()))
end

function Dealership:CleanVehicleSpawn()
    local coords = self.vehicle.spawn.xyz
    local stillThere = true
    while stillThere do
        local closestVehicle = QBCore.Functions.GetClosestVehicle(coords)
        if #(coords - GetEntityCoords(closestVehicle)) <= 3.0 then
            SetEntityAsMissionEntity(closestVehicle, true, true)
            DeleteVehicle(closestVehicle)
        else
            stillThere = false
        end
    end
end

function Dealership:VisualizeVehicle(vehicle)
    local model = GetHashKey(vehicle.model)
    RequestModel(model)
    while not HasModelLoaded(model) do
        Citizen.Wait(10)
    end

    local vehiclePosition = self.vehicle.spawn
    local createdVehicle = CreateVehicle(model, vehiclePosition.x, vehiclePosition.y, vehiclePosition.z, vehiclePosition.w, false, false)

    SetModelAsNoLongerNeeded(model)
    SetVehicleOnGroundProperly(createdVehicle)
    SetEntityInvincible(createdVehicle, true)
    SetVehicleDoorsLocked(createdVehicle, 6)
    FreezeEntityPosition(createdVehicle, true)
    SetVehicleNumberPlateText(createdVehicle, "SOZ")
end

function Dealership:GenerateVehicleButton(vehicle)
    local label = vehicle.name
    local description = "Acheter " .. label
    local value = self.confirmMenu
    local select = function()
        self:GenerateConfirmMenu(vehicle)
    end
    if vehicle.stock == 0 then
        label = "^9" .. label
        description = "❌ HORS STOCK de " .. label
        select = function()
        end
        value = nil
    elseif vehicle.stock == 1 then
        label = "~o~" .. label
        description = "⚠ Stock limité de  " .. label
    end
    return {
        label = label,
        rightLabel = "💸 $" .. QBCore.Shared.GroupDigits(vehicle.price),
        value = value,
        description = description,
        select = select,
        enter = function()
            self:CleanVehicleSpawn()
            self:VisualizeVehicle(vehicle)
        end,
    }
end

-- Menu Functions
function Dealership:GenerateSubMenus()
    self.menu:ClearItems()
    for _, category in pairs(self.catalog) do
        local namespace = ("soz:dealership:" .. self.key .. ":" .. category.key):lower()
        if not MenuV:IsNamespaceAvailable(namespace) then
            MenuV:DeleteNamespace(namespace)
        end
        local subMenu = createMenu(category.name, namespace)
        for _, vehReference in pairs(category.vehicles) do
            subMenu:AddButton(self:GenerateVehicleButton(vehReference))
        end

        self.menu:AddButton({label = category.name, value = subMenu})
    end
end

function Dealership:GenerateConfirmMenu(selectedVehicle)
    self.confirmMenu:ClearItems()
    self.confirmMenu:AddTitle({label = selectedVehicle.name})
    local vehicleLabelText = selectedVehicle.name
    self.confirmMenu:AddButton({
        label = "Acheter " .. vehicleLabelText,
        rightLabel = "💸 $" .. QBCore.Shared.GroupDigits(selectedVehicle.price),
        description = "Confirmer l'achat",
        select = function()
            MenuV:CloseAll(function()
                TriggerServerEvent("soz-concess:server:buyShowroomVehicle", self.key, selectedVehicle.model)
                self:CleanVehicleSpawn()
                self:DeleteCam()
            end)
        end,
    })
end

-- Put in a init.lua file
local dealerships = {}

AddEventHandler("onClientResourceStart", function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end
    for dealerKey, config in pairs(Config.Dealerships) do
        if config.active then
            local dealership = Dealership:new(dealerKey, config)
            dealership:SpawnPed()

            QBCore.Functions.CreateBlip(dealerKey .. ":dealership",
                                        {
                name = config.blip.name,
                coords = config.blip.coords,
                sprite = config.blip.sprite,
                color = config.blip.color,
            })

            local zoneConfig = config.ped.zone
            local zone = BoxZone:new(zoneConfig.center, zoneConfig.length, zoneConfig.width, zoneConfig.options)
            zone:onPlayerInOut(function(isPointInside)
                dealership:SetInside(isPointInside)
                if isPointInside then
                    exports["qb-target"]:AddTargetModel(config.ped.model, {
                        options = {
                            {
                                icon = "c:dealership/list.png",
                                label = "Accéder au catalogue",
                                action = function()
                                    dealership:GenerateSubMenus()
                                    dealership.menu:Open()
                                end,
                                canInteract = function()
                                    local licences = PlayerData.metadata["licences"]
                                    return dealership.isInside and (dealership.licence == nil or licences ~= nil and licences[dealership.licence] > 0)
                                end,
                                blackoutGlobal = true,
                            },
                        },
                        distance = 2.5,
                    })
                else
                    exports["qb-target"]:RemoveTargetModel(config.ped.model, "Accéder au catalogue")
                end
            end)
            table.insert(dealerships, dealership)
        end
    end
end)

AddEventHandler("onClientResourceStop", function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end
    for dealership in dealerships do
        dealership:Destroy()
    end
end)
