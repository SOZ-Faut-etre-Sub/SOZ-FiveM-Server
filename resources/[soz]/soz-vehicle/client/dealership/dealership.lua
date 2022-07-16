Dealership = {}

local function generateCatalog(dealershipKey)
    local catalog = {}

    for dealershipCategoryKey, dealershipCategoryName in pairs(Config.Dealerships[dealershipKey].categories) do
        local categoryIndex = #catalog + 1
        for _, vehicle in pairs(QBCore.Shared.Vehicles) do
            local vehicleCategory = vehicle.category
            if dealershipCategoryKey == vehicleCategory then
                if catalog[categoryIndex] == nil then
                    catalog[categoryIndex] = {
                        ["key"] = dealershipCategoryKey,
                        ["name"] = dealershipCategoryName,
                        ["vehicles"] = {},
                    }
                end
                local index = #catalog[categoryIndex].vehicles + 1
                catalog[categoryIndex].vehicles[index] = vehicle
            end
        end
        if catalog[categoryIndex] ~= nil and catalog[categoryIndex].vehicles ~= nil then
            table.sort(catalog[categoryIndex].vehicles, function(vehA, vehB)
                return vehA.price < vehB.price
            end)
        end
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
    local confirmMenu = createMenu("")

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
        selectedVehicle = nil,
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

function Dealership:SetSelectedVehicle(value)
    self.selectedVehicle = value
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

function Dealership:GenerateVehicleButton(stock, vehicle)
    local vehicleName = GetLabelText(GetDisplayNameFromVehicleModel(vehicle["hash"]))
    local label = vehicle.name
    local description = "Acheter " .. vehicleName
    local value = self.confirmMenu
    local select = function()
        self:SetSelectedVehicle(vehicle)
        self:GenerateConfirmMenu()
    end
    if stock == 0 then
        label = "^9" .. label
        description = "❌ HORS STOCK de " .. vehicleName
        select = function()
        end
        value = nil
    elseif stock == 1 then
        label = "~o~" .. vehicle.name
        description = "⚠ Stock limité de  " .. vehicleName
    end
    return {
        label = label,
        rightLabel = "💸 $" .. DisplayAmountWithCommas(vehicle.price),
        value = value,
        description = description,
        select = select,
        enter = function()
            self:CleanVehicleSpawn()
            self:VisualizeVehicle(vehicle)
        end,
    }
end

function Dealership:GetStockFromVehicle(vehiclesStock, model)
    for _, vehicleInStock in pairs(vehiclesStock) do
        if model == vehicleInStock.model then
            return vehicleInStock.stock
        end
    end
    return nil
end

-- Menu Functions
function Dealership:GenerateSubMenus()
    self.menu:ClearItems()
    for _, category in pairs(self.catalog) do
        local vehiclesStock = QBCore.Functions.Retry(function()
            return QBCore.Functions.TriggerRpc("soz-concess:server:getstock", category.key)
        end, 5)
        local namespace = ("soz:dealership:" .. self.key .. ":" .. category.key):lower()
        if not MenuV:IsNamespaceAvailable(namespace) then
            MenuV:DeleteNamespace(namespace)
        end
        local subMenu = createMenu(category.name, namespace)
        for _, vehReference in pairs(category.vehicles) do
            local stock = self:GetStockFromVehicle(vehiclesStock, vehReference.model)
            if stock ~= nil then
                subMenu:AddButton(self:GenerateVehicleButton(stock, vehReference))
            end
        end

        self.menu:AddButton({label = category.name, value = subMenu})
    end
end

function Dealership:GenerateConfirmMenu()
    self.confirmMenu:ClearItems()
    self.confirmMenu:AddTitle({label = self.selectedVehicle.name})
    local vehicleLabelText = self.selectedVehicle.name
    self.confirmMenu:AddButton({
        label = "Acheter " .. vehicleLabelText,
        rightLabel = "💸 $" .. DisplayAmountWithCommas(self.selectedVehicle.price),
        description = "Confirmer l'achat",
        select = function()
            MenuV:CloseAll(function()
                TriggerServerEvent("soz-concess:server:buyShowroomVehicle", self.key, self.selectedVehicle.model)
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
