QBCore = exports["qb-core"]:GetCoreObject()

VehicleStatus = {}
local PlayerJob = {}
local onDuty = false
local effectTimer = 0

local VehiculeOptions = MenuV:CreateMenu(nil, "Station entretien", "menu_shop_vehicle_car", "soz", "mechanic:vehicle:options")
local Status = MenuV:InheritMenu(VehiculeOptions, "Status")
local VehiculeCustom = MenuV:InheritMenu(VehiculeOptions, "Customisation")
local NoDamage = MenuV:InheritMenu(Status, "No Damage")
local PartMenu = MenuV:InheritMenu(Status, "Part Menu")
local VehiculeWash = MenuV:CreateMenu(nil, "Station lavage", "menu_shop_vehicle_car", "soz", "mechanic:vehicle:wash")

local SpoilersMenu = MenuV:InheritMenu(VehiculeCustom, "Choisir un mod")
local ExtrasMenu = MenuV:InheritMenu(VehiculeCustom, "Vehicle Extras Customisation")
local ResprayMenu = MenuV:InheritMenu(VehiculeCustom, "Respray")
local ResprayTypeMenu = MenuV:InheritMenu(ResprayMenu, "Respray Types")
local ResprayColoursMenu = MenuV:InheritMenu(ResprayMenu, "Respray Colours")
local WindowTintMenu = MenuV:InheritMenu(VehiculeCustom, "Window Tint")
local NeonsMenu = MenuV:InheritMenu(VehiculeCustom, "Neons")
local NeonStateMenu = MenuV:InheritMenu(NeonsMenu, "Neon State")
local NeonColoursMenu = MenuV:InheritMenu(NeonsMenu, "Neon Colours")
local XenonsMenu = MenuV:InheritMenu(VehiculeCustom, "Xenons")
local XenonsHeadlightsMenu = MenuV:InheritMenu(XenonsMenu, "Xenons Headlights")
local XenonsColoursMenu = MenuV:InheritMenu(XenonsMenu, "Xenons Colours")

local WheelsMenu = MenuV:InheritMenu(VehiculeCustom, "Wheels")
local TyreSmokeMenu = MenuV:InheritMenu(WheelsMenu, "Tyre Smoke Customisation")
local CustomWheelsMenu = MenuV:InheritMenu(WheelsMenu, "Enable or Disable Custom Wheels")
local ChooseWheelMenu = MenuV:InheritMenu(WheelsMenu, "Choose a Wheel")

local OldLiveryMenu = MenuV:InheritMenu(VehiculeCustom, "Old Livery")
local PlateIndexMenu = MenuV:InheritMenu(VehiculeCustom, "Plate Index")


local function OpenChooseWheelMenu(menu, k, v)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })
    local validMods, amountValidMods = CheckValidMods(v.category, v.wheelID, v.id)
    for m, n in pairs(validMods) do
        menu:AddButton({
            label = n.name,
            value = n.id,
            description = "Améliorer 🔧",
            select = function()
                menu:Close()
                ApplyWheel(v.category, n.id, v.id)
                -- ApplyWheel(categoryID, wheelID, wheelType)
            end,
        })
    end
    local eventwheelon = menu:On("switch", function(item, currentItem, prevItem)
        PreviewWheel(v.category, currentItem.Value, v.id)
    end)
    menu:On("close", function()
        menu:RemoveOnEvent("switch", eventwheelon)
        menu:Close()
        menu:ClearItems()
        RestoreOriginalWheels()
    end)
end

local function OpenCustomWheelsMenu(menu)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Wheels",
        select = function()
            menu:Close()
        end,
    })
    local currentCustomWheelState = GetCurrentCustomWheelState()
    if currentCustomWheelState == 0 then
        menu:AddButton({label = "Disable ~g~- Installed", description = ""})
        menu:AddButton({
            label = "Enable",
            description = "Améliorer 🔧",
            select = function()
                menu:Close()
                ApplyCustomWheel(1)
            end,
        })
    else
        menu:AddButton({
            label = "Disable",
            description = "Améliorer 🔧",
            select = function()
                menu:Close()
                ApplyCustomWheel(0)
            end,
        })
        menu:AddButton({label = "Enable ~g~- Installed", description = ""})
    end
    menu:On("close", function()
        menu:Close()
        menu:ClearItems()
    end)
end

local function OpenTyreSmokeMenu(menu)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Wheels",
        select = function()
            menu:Close()
        end,
    })
    local currentWheelSmokeR, currentWheelSmokeG, currentWheelSmokeB = GetCurrentVehicleWheelSmokeColour()
    for k, v in ipairs(Config.vehicleTyreSmokeOptions) do
        if v.r == currentWheelSmokeR and v.g == currentWheelSmokeG and v.b == currentWheelSmokeB then
            menu:AddButton({label = v.name .. " ~g~- Installed"})
        else
            menu:AddButton({
                label = v.name,
                description = "Améliorer 🔧",
                select = function()
                    menu:Close()
                    ApplyTyreSmoke(v.r, v.g, v.b)
                end,
            })
        end
    end
    menu:On("close", function()
        menu:Close()
        menu:ClearItems()
    end)
end

local function OpenWheelsMenu(menu, isMotorcycle)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })
    for k, v in ipairs(Config.vehicleWheelOptions) do
        if isMotorcycle then
            if v.id == -1 or v.id == 20 or v.id == 6 then
                menu:AddButton({
                    label = v.category,
                    description = "",
                    select = function()
                        if v.id == 20 then
                            OpenTyreSmokeMenu(TyreSmokeMenu)
                        elseif v.id == -1 then
                            OpenCustomWheelsMenu(CustomWheelsMenu)
                        elseif v.id == 6 then
                            OpenChooseWheelMenu(ChooseWheelMenu, k, v)
                        end
                    end,
                })
            end
        elseif v.id ~= 6 then
            menu:AddButton({
                label = v.category,
                description = "",
                select = function()
                    if v.id == 20 then
                        OpenTyreSmokeMenu(TyreSmokeMenu)
                    elseif v.id == -1 then
                        OpenCustomWheelsMenu(CustomWheelsMenu)
                    else
                        OpenChooseWheelMenu(ChooseWheelMenu, k, v)
                    end
                end,
            })
        end
    end
end

local function OpenResprayColoursMenu(menu, v, colorcat)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })

    for m, n in ipairs(v.colours) do
        menu:AddButton({
            label = n.name,
            description = "Améliorer 🔧",
            value = n.id,
            select = function()
                menu:Close()
                ApplyColour(colorcat, v.id, n.id)
            end,
        })
    end
    local eventresprayon = menu:On("switch", function(item, currentItem, prevItem)
        PreviewColour(colorcat, v.id, currentItem.Value)
    end)
    menu:On("close", function()
        menu:RemoveOnEvent("switch", eventresprayon)
        menu:Close()
        menu:ClearItems()
        RestoreOriginalColours()
    end)
end

local function OpenResprayTypeMenu(menu, colorcat)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Colour category",
        select = function()
            menu:Close()
        end,
    })

    for k, v in ipairs(Config.vehicleResprayOptions) do
        menu:AddButton({
            label = v.category,
            description = "",
            select = function()
                OpenResprayColoursMenu(ResprayColoursMenu, v, colorcat)
            end,
        })
    end
end

local function OpenResprayMenu(menu)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })

    menu:AddButton({
        label = "Primary Colour",
        select = function()
            OpenResprayTypeMenu(ResprayTypeMenu, 0)
        end,
    })
    menu:AddButton({
        label = "Secondary Colour",
        select = function()
            OpenResprayTypeMenu(ResprayTypeMenu, 1)
        end,
    })
    menu:AddButton({
        label = "Pearlescent Colour",
        select = function()
            OpenResprayTypeMenu(ResprayTypeMenu, 2)
        end,
    })
    menu:AddButton({
        label = "Wheel Colour",
        select = function()
            OpenResprayTypeMenu(ResprayTypeMenu, 3)
        end,
    })
    menu:AddButton({
        label = "Interior Colour",
        select = function()
            OpenResprayTypeMenu(ResprayTypeMenu, 4)
        end,
    })
    menu:AddButton({
        label = "Dashboard Colour",
        select = function()
            OpenResprayTypeMenu(ResprayTypeMenu, 5)
        end,
    })
end

local function OpenNeonColoursMenu(menu)
    local currentNeonR, currentNeonG, currentNeonB = GetCurrentNeonColour()
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Neons Menu",
        select = function()
            menu:Close()
        end,
    })
    for k, v in ipairs(Config.vehicleNeonOptions.neonColours) do
        if currentNeonR == Config.vehicleNeonOptions.neonColours[k].r and currentNeonG == Config.vehicleNeonOptions.neonColours[k].g and currentNeonB ==
            Config.vehicleNeonOptions.neonColours[k].b then
            menu:AddButton({label = v.name .. " ~g~- Installed", value = k})
        else
            menu:AddButton({
                label = v.name,
                value = k,
                description = "Améliorer 🔧",
                select = function()
                    menu:Close()
                    ApplyNeonColour(Config.vehicleNeonOptions.neonColours[k].r, Config.vehicleNeonOptions.neonColours[k].g,
                                    Config.vehicleNeonOptions.neonColours[k].b)
                end,
            })
        end
    end
    local eventneoncolon = menu:On("switch", function(item, currentItem, prevItem)
        PreviewNeonColour(Config.vehicleNeonOptions.neonColours[currentItem.Value].r, Config.vehicleNeonOptions.neonColours[currentItem.Value].g,
                          Config.vehicleNeonOptions.neonColours[currentItem.Value].b)
    end)
    menu:On("close", function()
        menu:RemoveOnEvent("switch", eventneoncolon)
        menu:Close()
        menu:ClearItems()
        RestoreOriginalNeonColours()
    end)
end

local function OpenNeonStateMenu(menu, v, k)
    local currentNeonState = GetCurrentNeonState(v.id)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Neons Menu",
        select = function()
            menu:Close()
        end,
    })
    if currentNeonState == 0 then
        menu:AddButton({label = "Disable ~g~- Installed", value = 0})
        menu:AddButton({
            label = "Enable",
            value = 1,
            description = "Améliorer 🔧",
            select = function()
                menu:Close()
                ApplyNeon(v.id, 1)
            end,
        })
    else
        menu:AddButton({
            label = "Disable - $0",
            value = 0,
            description = "Améliorer 🔧",
            select = function()
                menu:Close()
                ApplyNeon(v.id, 0)
            end,
        })
        menu:AddButton({label = "Enable ~g~- Installed", value = 1})
    end
    local eventneonstateon = menu:On("switch", function(item, currentItem, prevItem)
        PreviewNeon(v.id, currentItem.Value)
    end)
    menu:On("close", function()
        menu:RemoveOnEvent("switch", eventneonstateon)
        menu:Close()
        menu:ClearItems()
        RestoreOriginalNeonStates()
    end)
end

local function OpenNeonsMenu(menu)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })
    for k, v in ipairs(Config.vehicleNeonOptions.neonTypes) do
        menu:AddButton({
            label = v.name,
            description = "Enable or Disable Neon",
            select = function()
                OpenNeonStateMenu(NeonStateMenu, v, k)
            end,
        })
    end
    menu:AddButton({
        label = "Neon Colours",
        description = "",
        select = function()
            OpenNeonColoursMenu(NeonColoursMenu)
        end,
    })
end

local function OpenXenonsColoursMenu(menu)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Menu Xenon",
        select = function()
            menu:Close()
        end,
    })
    local currentXenonColour = GetCurrentXenonColour()
    for k, v in ipairs(Config.vehicleXenonOptions.xenonColours) do
        if currentXenonColour == v.id then
            menu:AddButton({label = v.name .. " ~g~- Installed", value = v.id})
        else
            menu:AddButton({
                label = v.name,
                value = v.id,
                description = "Améliorer 🔧",
                select = function()
                    menu:Close()
                    ApplyXenonColour(v.id)
                end,
            })
        end
    end
    local eventxenoncolon = menu:On("switch", function(item, currentItem, prevItem)
        PreviewXenonColour(currentItem.Value)
    end)
    menu:On("close", function()
        menu:RemoveOnEvent("switch", eventxenoncolon)
        menu:Close()
        menu:ClearItems()
        RestoreOriginalXenonColour()
    end)
end

local function OpenXenonsHeadlightsMenu(menu)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Menu Xenon",
        select = function()
            menu:Close()
        end,
    })
    local currentXenonState = GetCurrentXenonState()
    if currentXenonState == 0 then
        menu:AddButton({label = "Disable Xenons ~g~- Installed", description = ""})
        menu:AddButton({
            label = "Enable Xenons",
            description = "Améliorer 🔧",
            select = function()
                menu:Close()
                ApplyXenonLights(22, 1)
            end,
        })
    else
        menu:AddButton({
            label = "Disable Xenons - $0",
            description = "Améliorer 🔧",
            select = function()
                menu:Close()
                ApplyXenonLights(22, 0)
            end,
        })
        menu:AddButton({label = "Enable Xenons ~g~- Installed"})
    end
    menu:On("close", function()
        menu:Close()
        menu:ClearItems()
    end)
end

local function OpenXenonsMenu(menu)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })
    menu:AddButton({
        label = "Headlights",
        description = "",
        select = function()
            OpenXenonsHeadlightsMenu(XenonsHeadlightsMenu)
        end,
    })
    menu:AddButton({
        label = "Xenon Colours",
        description = "",
        select = function()
            OpenXenonsColoursMenu(XenonsColoursMenu)
        end,
    })
end

local function OpenWindowTintMenu(menu)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })
    local currentWindowTint = GetCurrentWindowTint()

    for k, v in ipairs(Config.vehicleWindowTintOptions) do
        if currentWindowTint == v.id then
            menu:AddButton({label = v.name .. " ~g~- Installed", value = v.id})
        else
            menu:AddButton({
                label = v.name,
                value = v.id,
                description = "Améliorer 🔧",
                select = function()
                    menu:Close()
                    ApplyWindowTint(v.id)
                end,
            })
        end
    end
    local eventwindowon = menu:On("switch", function(item, currentItem, prevItem)
        PreviewWindowTint(currentItem.Value)
    end)
    menu:On("close", function()
        menu:RemoveOnEvent("switch", eventwindowon)
        menu:Close()
        menu:ClearItems()
        RestoreOriginalWindowTint()
    end)
end

local function OpenSpoilersMenu(menu, k, v, validMods, currentMod)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })
    for m, n in pairs(validMods) do
        if currentMod == n.id then
            menu:AddButton({label = n.name, rightLabel = " ~g~- Installed", value = n.id})
        else
            menu:AddButton({
                label = n.name,
                value = n.id,
                description = "Améliorer 🔧",
                select = function()
                    menu:Close()
                    ApplyMod(v.id, n.id)
                end,
            })
        end
    end
    local eventspoileron = menu:On("switch", function(item, currentItem, prevItem)
        PreviewMod(v.id, currentItem.Value)
    end)
    menu:On("close", function()
        menu:RemoveOnEvent("switch", eventspoileron)
        menu:Close()
        menu:ClearItems()
        RestoreOriginalMod()
    end)
end

local function OpenOldLiveryMenu(menu)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })
    local plyVeh = GetVehiclePedIsIn(PlayerPedId(), false)
    local livCount = GetVehicleLiveryCount(plyVeh)
    if livCount > 0 then
        local tempOldLivery = GetVehicleLivery(plyVeh)
        if GetVehicleClass(plyVeh) ~= 18 then
            for i = 0, GetVehicleLiveryCount(plyVeh) - 1 do
                if tempOldLivery == i then
                    menu:AddButton({label = i " ~g~- Installed", value = i})
                else
                    menu:AddButton({
                        label = i,
                        value = i,
                        description = "Améliorer 🔧",
                        select = function()
                            menu:Close()
                            ApplyOldLivery(i)
                        end,
                    })
                end
            end
        end
    end
    local eventoldlivon = menu:On("switch", function(item, currentItem, prevItem)
        PreviewOldLivery(currentItem.Value)
    end)
    menu:On("close", function()
        menu:RemoveOnEvent("switch", eventoldlivon)
        menu:Close()
        menu:ClearItems()
        RestoreOldLivery()
    end)
end

local function OpenExtrasMenu(menu)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })
    local plyVeh = GetVehiclePedIsIn(PlayerPedId(), false)
    if GetVehicleClass(plyVeh) ~= 18 then
        for i = 1, 12 do
            if DoesExtraExist(plyVeh, i) then
                menu:AddButton({
                    label = "Extra " .. tostring(i) .. " Toggle",
                    select = function()
                        menu:Close()
                        ApplyExtra(i)
                    end,
                })
            else
                menu:AddButton({label = "No Option"})
            end
        end
    end
    menu:On("close", function()
        menu:Close()
        menu:ClearItems()
    end)
end

local function OpenPlateIndexMenu(menu)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })
    local plyVeh = GetVehiclePedIsIn(PlayerPedId(), false)
    local tempPlateIndex = GetVehicleNumberPlateTextIndex(plyVeh)
    local plateTypes = {
        "Blue on White #1",
        "Yellow on Black",
        "Yellow on Blue",
        "Blue on White #2",
        "Blue on White #3",
        "North Yankton",
    }
    if GetVehicleClass(plyVeh) ~= 18 then
        for i = 0, #plateTypes - 1 do
            if i ~= 4 then
                if tempPlateIndex == i then
                    menu:AddButton({label = plateTypes[i + 1] .. " ~g~- Installed", value = i + 1})
                else
                    menu:AddButton({
                        label = plateTypes[i + 1],
                        value = i + 1,
                        description = "Améliorer 🔧",
                        select = function()
                            menu:Close()
                            ApplyPlateIndex(i + 1)
                        end,
                    })
                end
            end
        end
    end
    local eventplateon = menu:On("switch", function(item, currentItem, prevItem)
        PreviewPlateIndex(currentItem.Value)
    end)
    menu:On("close", function()
        menu:RemoveOnEvent("switch", eventplateon)
        menu:Close()
        menu:ClearItems()
        RestorePlateIndex()
    end)
end

local function OpenPart(menu, v, k)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    local partName = v
    local part = k
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })
    menu:AddButton({
        label = "Réparer " .. partName .. " 🔧",
        select = function()
            menu:Close()
            TriggerEvent("soz-mechanicjob:client:RepairPart", part)
        end,
    })
    menu:On("close", function()
        menu:Close()
        menu:ClearItems()
    end)
end

local function OpenNoDamageMenu(menu, v, k)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        description = "Cette pièce n'est pas endommagée",
        select = function()
            menu:Close()
        end,
    })
    menu:On("close", function()
        menu:Close()
        menu:ClearItems()
    end)
end

local function OpenPartsMenu(menu)
    local plate = QBCore.Functions.GetPlate(Config.AttachedVehicle)
    if VehicleStatus[plate] ~= nil then
        menu:ClearItems()
        MenuV:OpenMenu(menu)
        menu:AddButton({
            icon = "◀",
            label = "Menu Benny's",
            select = function()
                menu:Close()
            end,
        })
        for k, v in pairs(Config.ValuesLabels) do
            if math.ceil(VehicleStatus[plate][k]) ~= Config.MaxStatusValues[k] then
                local percentage = math.ceil(VehicleStatus[plate][k])
                if percentage > 100 then
                    percentage = math.ceil(VehicleStatus[plate][k]) / 10
                end
                menu:AddButton({
                    label = v,
                    description = "Etat: " .. percentage .. "% / 100.0%",
                    select = function()
                        OpenPart(PartMenu, v, k)
                    end,
                })
            else
                local percentage = math.ceil(Config.MaxStatusValues[k])
                if percentage > 100 then
                    percentage = math.ceil(Config.MaxStatusValues[k]) / 10
                end
                menu:AddButton({
                    label = v,
                    description = "Etat: " .. percentage .. "% / 100.0%",
                    select = function()
                        OpenNoDamageMenu(NoDamage)
                    end,
                })
            end
        end
    end
end

local function OpenCustom(menu)
    local veh = GetVehiclePedIsIn(PlayerPedId(), false)
    local isMotorcycle = GetVehicleClass(plyVeh) == 8 -- Moto
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Menu Benny's",
        select = function()
            menu:Close()
        end,
    })
    for k, v in ipairs(Config.vehicleCustomisationMechanic) do
        local validMods, amountValidMods = CheckValidMods(v.category, v.id)
        local currentMod, currentModName = GetCurrentMod(v.id)
        if amountValidMods > 0 then
            menu:AddButton({
                label = v.category,
                select = function()
                    OpenSpoilersMenu(SpoilersMenu, k, v, validMods, currentMod)
                end,
            })
        end
    end
    menu:AddButton({
        label = "Respray",
        select = function()
            OpenResprayMenu(ResprayMenu)
        end,
    })
    if not isMotorcycle then
        menu:AddButton({
            label = "Window Tint",
            select = function()
                OpenWindowTintMenu(WindowTintMenu)
            end,
        })
        menu:AddButton({
            label = "Neons",
            select = function()
                OpenNeonsMenu(NeonsMenu)
            end,
        })
    end
    menu:AddButton({
        label = "Xenons",
        select = function()
            OpenXenonsMenu(XenonsMenu)
        end,
    })
    menu:AddButton({
        label = "Wheels",
        select = function()
            OpenWheelsMenu(WheelsMenu, isMotorcycle)
        end,
    })
    menu:AddButton({
        label = "Old Livery",
        select = function()
            OpenOldLiveryMenu(OldLiveryMenu)
        end,
    })
    menu:AddButton({
        label = "Plate Index",
        select = function()
            OpenPlateIndexMenu(PlateIndexMenu)
        end,
    })
    menu:AddButton({
        label = "Vehicle Extras",
        select = function()
            OpenExtrasMenu(ExtrasMenu)
        end,
    })
end

local function OpenMenu(menu)
    local veh = GetVehiclePedIsIn(PlayerPedId(), false)
    FreezeEntityPosition(veh, true)
    SetEntityHeading(veh, 90.0)
    menu:AddButton({
        icon = "◀",
        label = "Libérer le véhicule",
        description = "Détacher le véhicule de la plateforme",
        select = function()
            TriggerEvent("soz-mechanicjob:client:UnattachVehicle")
            exports["soz-hud"]:DrawNotification("Véhicule libéré")
            FreezeEntityPosition(veh, false)
            menu:Close()
            saveVehicle()
        end,
    })
    menu:AddButton({
        label = "Réparation du véhicule",
        description = "Réparer les pièces du véhicule",
        select = function()
            OpenPartsMenu(Status)
        end,
    })
    menu:AddButton({
        label = "Customisation du véhicule",
        description = "Changer les composants du véhicule",
        select = function()
            SetVehicleModKit(veh, 0)
            OpenCustom(VehiculeCustom)
        end,
    })
end

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

local function GenerateOpenMenu()
    if VehiculeOptions.IsOpen then
        VehiculeOptions:Close()
    else
        VehiculeOptions:ClearItems()
        OpenMenu(VehiculeOptions)
        VehiculeOptions:Open()
    end
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

local function UnattachVehicle()
    FreezeEntityPosition(Config.AttachedVehicle, false)
    Config.AttachedVehicle = nil
    TriggerServerEvent("qb-vehicletuning:server:SetAttachedVehicle", false)
end

local function SpawnListVehicle(model)
    local coords = {
        x = Config.Locations["vehicle"].x,
        y = Config.Locations["vehicle"].y,
        z = Config.Locations["vehicle"].z,
        w = Config.Locations["vehicle"].w,
    }

    QBCore.Functions.SpawnVehicle(model, function(veh)
        SetVehicleNumberPlateText(veh, "ACBV" .. tostring(math.random(1000, 9999)))
        SetEntityHeading(veh, coords.w)
        exports["soz-vehicle"]:SetFuel(veh, 100.0)
        TaskWarpPedIntoVehicle(PlayerPedId(), veh, -1)
        TriggerEvent("vehiclekeys:client:SetOwner", QBCore.Functions.GetPlate(veh))
        SetVehicleEngineOn(veh, true, true)
    end, coords, true)
end

local VehicleList = MenuV:CreateMenu(nil, "Vehicle List", "menu_shop_vehicle_car", "soz", "mechanic:vehicle:list")

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
                TriggerEvent("soz-mechanicjob:client:SpawnListVehicle", k)
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

local function RepairPart(part)
    TriggerEvent("animations:client:EmoteCommandStart", {"mechanic"})
    QBCore.Functions.Progressbar("repair_part", "Repairing " .. Config.ValuesLabels[part], math.random(5000, 10000), false, true,
                                 {
        disableMovement = true,
        disableCarMovement = true,
        disableMouse = false,
        disableCombat = true,
    }, {}, {}, {}, function() -- Done
        TriggerEvent("animations:client:EmoteCommandStart", {"c"})
        TriggerEvent("qb-vehicletuning:client:RepaireeePart", part)
        SetTimeout(250, function()
            OpenPartsMenu(Status)
        end)
    end, function()
        exports["soz-hud"]:DrawNotification("~r~Réparation annulée")
    end)

end

------------
-- EVENTS --
------------

RegisterNetEvent("soz-mechanicjob:client:UnattachVehicle", function()
    UnattachVehicle()
end)

RegisterNetEvent("soz-mechanicjob:client:SpawnListVehicle", function(vehicleSpawnName)
    SpawnListVehicle(vehicleSpawnName)
end)

RegisterNetEvent("soz-mechanicjob:client:RepairPart", function(part)
    RepairPart(part)
end)

RegisterNetEvent("QBCore:Client:OnPlayerLoaded", function()
    QBCore.Functions.GetPlayerData(function(PlayerData)
        PlayerJob = PlayerData.job
        if PlayerData.job.onduty then
            if PlayerData.job.name == "garagist" then
                TriggerServerEvent("QBCore:ToggleDuty")
            end
        end
    end)
    QBCore.Functions.TriggerCallback("qb-vehicletuning:server:GetAttachedVehicle", function(veh)
        Config.AttachedVehicle = veh
    end)

    QBCore.Functions.TriggerCallback("qb-vehicletuning:server:GetDrivingDistances", function(retval)
        DrivingDistance = retval
    end)
end)

RegisterNetEvent("QBCore:Client:OnJobUpdate", function(JobInfo)
    PlayerJob = JobInfo
    onDuty = PlayerJob.onduty
end)

RegisterNetEvent("QBCore:Client:SetDuty", function(duty)
    onDuty = duty
end)

RegisterNetEvent("qb-vehicletuning:client:SetAttachedVehicle", function(veh)
    if veh ~= false then
        Config.AttachedVehicle = veh
    else
        Config.AttachedVehicle = nil
    end
end)


-----------------------
-- POLYZONES & BLIPS --
-----------------------

CreateThread(function()
    local c = Config.Locations["exit"]
    local Blip = AddBlipForCoord(c.x, c.y, c.z)
    SetBlipSprite(Blip, 446)
    SetBlipDisplay(Blip, 4)
    SetBlipScale(Blip, 0.7)
    SetBlipAsShortRange(Blip, true)
    SetBlipColour(Blip, 0)
    SetBlipAlpha(Blip, 0.7)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentSubstringPlayerName("Benny's")
    EndTextCommandSetBlipName(Blip)
end)

Changemecha = BoxZone:Create(vector3(-205.29, -1331.31, 34.89), 5, 5, {
    name = "Changemecha_z",
    heading = 0,
    minZ = 33.89,
    maxZ = 37.89,
})

Dutymecha = BoxZone:Create(vector3(-204.9, -1337.93, 34.89), 5, 4, {
    name = "Dutymecha_z",
    heading = 0,
    minZ = 33.89,
    maxZ = 37.89,
})

Washmecha = BoxZone:Create(vector3(-198.92, -1324.4, 30.89), 8, 6, {
    name = "Washmecha_z",
    heading = 270,
    minZ = 29.89,
    maxZ = 33.89,
})

Vehiclemecha1 = BoxZone:Create(vector3(-222.43, -1324.31, 30.89), 7, 4, {
    name = "Vehiclemecha1_z",
    heading = 270,
    minZ = 29.89,
    maxZ = 33.89,
})

Vehiclemecha2 = BoxZone:Create(vector3(-222.23, -1329.66, 30.89), 7, 4, {
    name = "Vehiclemecha2_z",
    heading = 270,
    minZ = 29.89,
    maxZ = 33.89,
})

Vehiclespawn = BoxZone:Create(vector3(-163.47, -1301.73, 31.3), 20, 18, {
    name = "Vehiclespawn_z",
    heading = 90,
    minZ = 30.3,
    maxZ = 34.3,
})

Changemecha:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
    if isPointInside then
        exports["qb-target"]:AddTargetModel(-2094907124, {
            options = {
                {
                    type = "client",
                    -- event = "QBCore:ToggleDuty",
                    icon = "fas fa-tshirt",
                    label = "Se changer",
                    targeticon = "fas fa-wrench",
                    action = function(entity)
                        if IsPedAPlayer(entity) then
                            return false
                        end
                        -- TriggerServerEvent("QBCore:ToggleDuty")
                    end,
                },
            },
            distance = 2.5,
        })
    else
        exports["qb-target"]:RemoveTargetModel(-2094907124, "Service")
    end
end)

Dutymecha:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
    if isPointInside then
        exports["qb-target"]:AddTargetModel(829413118, {
            options = {
                {
                    type = "client",
                    event = "QBCore:ToggleDuty",
                    icon = "fas fa-sign-in-alt",
                    label = "Service",
                    targeticon = "fas fa-wrench",
                    action = function(entity)
                        if IsPedAPlayer(entity) then
                            return false
                        end
                        TriggerServerEvent("QBCore:ToggleDuty")
                    end,
                },
            },
            distance = 2.5,
        })
    else
        exports["qb-target"]:RemoveTargetModel(829413118, "Service")
    end
end)

local insidemecha = false
local insidewash = false
local insidespawn = false

Vehiclemecha1:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
    if isPointInside then
        if onDuty then
            if Config.AttachedVehicle == nil then
                if IsPedInAnyVehicle(PlayerPedId()) then
                    local veh = GetVehiclePedIsIn(PlayerPedId())
                    if not IsThisModelABicycle(GetEntityModel(veh)) then
                        insidemecha = true
                    else
                        exports["soz-hud"]:DrawNotification("~r~Vous ne pouvez pas mette de vélos")
                    end
                end
            end
        end
    else
        insidemecha = false
        VehiculeOptions:Close()
        Config.AttachedVehicle = nil
    end
end)

Vehiclemecha2:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
    if isPointInside then
        if onDuty then
            if Config.AttachedVehicle == nil then
                if IsPedInAnyVehicle(PlayerPedId()) then
                    local veh = GetVehiclePedIsIn(PlayerPedId())
                    if not IsThisModelABicycle(GetEntityModel(veh)) then
                        insidemecha = true
                    else
                        exports["soz-hud"]:DrawNotification("~r~Vous ne pouvez pas mette de vélos")
                    end
                end
            end
        end
    else
        insidemecha = false
        VehiculeOptions:Close()
        Config.AttachedVehicle = nil
    end
end)

Vehiclespawn:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
    if isPointInside then
        if onDuty then
            insidespawn = true
        end
    else
        insidespawn = false
        VehicleList:Close()
    end
end)

Washmecha:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
    if isPointInside then
        if onDuty then
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
        insidewash = false
        VehiculeWash:Close()
    end
end)

CreateThread(function()
    while true do
        if insidemecha == true then
            QBCore.Functions.ShowHelpNotification("~INPUT_CONTEXT~ Menu d'entretien")
            if IsControlJustPressed(1, 51) then
                local veh = GetVehiclePedIsIn(PlayerPedId())
                Config.AttachedVehicle = veh
                TriggerServerEvent("qb-vehicletuning:server:SetAttachedVehicle", veh)
                GenerateOpenMenu()
            end
        end
        Wait(2)
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

CreateThread(function()
    while true do
        Wait(1000)
        if (IsPedInAnyVehicle(PlayerPedId(), false)) then
            local veh = GetVehiclePedIsIn(PlayerPedId(), false)
            if not IsThisModelABicycle(GetEntityModel(veh)) and GetPedInVehicleSeat(veh, -1) == PlayerPedId() then
                local engineHealth = GetVehicleEngineHealth(veh)
                local bodyHealth = GetVehicleBodyHealth(veh)
                local plate = QBCore.Functions.GetPlate(veh)
                if VehicleStatus[plate] == nil then
                    TriggerServerEvent("vehiclemod:server:setupVehicleStatus", plate, engineHealth, bodyHealth)
                else
                    TriggerServerEvent("vehiclemod:server:updatePart", plate, "engine", engineHealth)
                    TriggerServerEvent("vehiclemod:server:updatePart", plate, "body", bodyHealth)
                    effectTimer = effectTimer + 1
                    if effectTimer >= math.random(10, 15) then
                        ApplyEffects(veh)
                        effectTimer = 0
                    end
                end
            else
                effectTimer = 0
                Wait(1000)
            end
        else
            effectTimer = 0
            Wait(2000)
        end
    end
end)
