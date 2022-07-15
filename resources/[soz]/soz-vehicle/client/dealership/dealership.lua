Dealership = {}

local function generateCatalog(dealershipKey)
    local catalog = {}

    for dealershipCategoryKey, dealershipCategoryName in pairs(Config.Dealerships[dealershipKey].categories) do
        local categoryIndex = #catalog + 1
        for _, vehicle in pairs(QBCore.Shared.Vehicles) do
            local vehicleCategory = vehicle.category
            if dealershipCategoryKey == vehicleCategory then
                if catalog[categoryIndex] == nil then
                    catalog[categoryIndex] = {["name"] = dealershipCategoryName, ["vehicles"] = {}}
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
    table.sort(catalog)
    return catalog
end

function Dealership:GetPedAction()
    return {
        icon = "c:dealership/list.png",
        label = "Accéder au concessionnaire",
        action = function()
            self:GenerateMenu()
            self.menu:Open()
        end,
        canInteract = function()
            if self.licence == nil then
                return true
            end
            local licences = PlayerData.metadata["licences"]
            return licences ~= nil and licences[self.licence] > 0
        end,
        blackoutGlobal = true,
    }
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
            target = {options = {self:GetPedAction()}, distance = 2.5},
        },
    })
end

function Dealership:SpawnBlip()
    QBCore.Functions.CreateBlip(self.key .. "dealership", {
        name = self.blip.name,
        coords = self.blip.coords,
        sprite = self.blip.sprite,
        color = self.blip.color,
    })
end

function Dealership:CreateMenu(subtitle, namespace)
    return MenuV:CreateMenu(nil, subtitle, "menu_shop_vehicle_car", "soz", namespace)
end

function Dealership:new(o, key, config)
    local dealership = o or {}
    setmetatable(dealership, self)
    self.__index = self
    dealership.key = key
    dealership.active = config.active
    dealership.categories = config.categories
    dealership.blip = config.blip
    dealership.licence = config.licence
    dealership.catalog = generateCatalog(key)
    dealership.vehicle = config.vehicle
    dealership.ped = config.ped
    dealership.menu = Dealership:CreateMenu("Veuillez choisir un véhicule", "shop:vehicle:" .. key)
    return dealership
end

function Dealership:destroy()
    self.menu:Close()
    MenuV:DeleteNamespace(namespace)
end

function Dealership:setupCam()
    local spawn = self.vehicle.spawn
    local camera = self.vehicle.camera
    local cam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", camera.x, camera.y, camera.z, camera.w or 0.0, 0.0, 0.0, 60.0, false, 0)
    PointCamAtCoord(cam, spawn.x, spawn.y, spawn.z)
    SetCamActive(cam, true)
    RenderScriptCams(true, true, 1, true, true)
end

function Dealership:deleteCam()
    RenderScriptCams(false)
    DestroyAllCams(true)
    SetFocusEntity(GetPlayerPed(PlayerId()))
end

function Dealership:generateVehicleButton(stock, vehicle)
    local vehicleName = GetLabelText(GetDisplayNameFromVehicleModel(vehicle["hash"]))
    local label = vehicle.name
    local description = "Acheter " .. vehicleName
    if stock == 0 then
        label = "^9" .. label
        description = "❌ HORS STOCK de " .. vehicleName
    elseif stock == 1 then
        label = "~o~" .. vehicle.name
        description = "⚠ Stock limité de  " .. vehicleName
        -- value = ChooseVehicleMenu,
        -- select = function()
        --    selectedVehicle = vehicle
        -- end,
    end
    return {
        label = label,
        rightLabel = "💸 " .. vehicle["price"] .. "$",
        -- value = ChooseVehicleMenu,
        description = description,
        select = function()
            -- selectedVehicle = vehicle
        end,
        enter = function()
            -- clean()
            -- previsualizeVehicle(vehicle)
        end,
    }
end

function Dealership:getStockFromVehicle(vehiclesStock, model)
    for _, vehicleInStock in pairs(vehiclesStock) do
        if model == vehicleInStock.model then
            return vehicleInStock.stock
        end
    end
    return nil
end

-- Menu Functions
function Dealership:GenerateMenu()
    self.menu:ClearItems()
    for categoryKey, category in pairs(self.catalog) do
        local vehiclesStock = QBCore.Functions.Retry(function()
            return QBCore.Functions.TriggerRpc("soz-concess:server:getstock", categoryKey)
        end, 5)
        local namespace = ("soz:dealership:" .. self.key .. ":" .. categoryKey):lower()
        if not MenuV:IsNamespaceAvailable(namespace) then
            MenuV:DeleteNamespace(namespace)
        end
        local subMenu = self:CreateMenu(category.name, namespace)
        for _, vehReference in pairs(category.vehicles) do
            local stock = self:getStockFromVehicle(vehiclesStock, vehReference.model)
            if stock ~= nil then
                subMenu:AddButton(self:generateVehicleButton(stock, vehReference))
            end
        end
        self.menu:AddButton({label = category.name, value = subMenu})
    end
end
-- Put in a init.lua file
local dealerships = {}

AddEventHandler("onClientResourceStart", function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end
    for dealerKey, config in pairs(Config.Dealerships) do
        if config.active then
            local dealership = Dealership:new(nil, dealerKey, config)
            dealership.SpawnPed(dealership)
            dealership.SpawnBlip(dealership)
            table.insert(dealerships, dealership)
        end
    end
end)

AddEventHandler("onClientResourceStop", function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
        return
    end
    for dealership in dealerships do
        dealership:destroy()
    end
end)
