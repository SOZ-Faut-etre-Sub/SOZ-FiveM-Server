local VehiculeOptions = MenuV:CreateMenu(nil, "Station entretien", "menu_job_depanneur", "soz", "mechanic:vehicle:options")
local Status = MenuV:InheritMenu(VehiculeOptions, "Etat")
local VehiculeCustom = MenuV:InheritMenu(VehiculeOptions, "Personnalisation")
local NoDamage = MenuV:InheritMenu(Status, "Aucun dommage")
local PartMenu = MenuV:InheritMenu(Status, "Menu pièces")
local SpoilersMenu = MenuV:InheritMenu(VehiculeCustom, "Choisir un mod")
local ExtrasMenu = MenuV:InheritMenu(VehiculeCustom, "Personnalisations autres")
local WindowTintMenu = MenuV:InheritMenu(VehiculeCustom, "Teinte Fenêtre")
local OldLiveryMenu = MenuV:InheritMenu(VehiculeCustom, "Livrée de base")
local PlateIndexMenu = MenuV:InheritMenu(VehiculeCustom, "Immatriculation")

local ResprayMenu = MenuV:InheritMenu(VehiculeCustom, "Peinture")
local ResprayTypeMenu = MenuV:InheritMenu(ResprayMenu, "Type de Peinture")
local ResprayColoursMenu = MenuV:InheritMenu(ResprayMenu, "Couleurs de Peinture")

local NeonsMenu = MenuV:InheritMenu(VehiculeCustom, "Néons")
local NeonStateMenu = MenuV:InheritMenu(NeonsMenu, "Etat des Néons")
local NeonColoursMenu = MenuV:InheritMenu(NeonsMenu, "Couleur des Néons")

local XenonsHeadlightsMenu = MenuV:InheritMenu(VehiculeCustom, "Xénons")

local WheelsMenu = MenuV:InheritMenu(VehiculeCustom, "Roues")
local TyreSmokeMenu = MenuV:InheritMenu(WheelsMenu, "Personnalisation de la fumée de roue")
local CustomWheelsMenu = MenuV:InheritMenu(WheelsMenu, "Activer ou désactiver les roues personnalisées")
local ChooseWheelMenu = MenuV:InheritMenu(WheelsMenu, "Choisir une roue")

Gready = false
Gfinishready = false
Gveh = nil
Gped = nil
Gcoords = nil
Gdict = nil
Gmodel = nil
Goffset = nil
Gheadin = nil
Gvehicle = nil
Gvehpos = nil
Gvehjack = nil


local function finishAnimation()
    Gdict = "move_crawl"
    local coords2 = GetEntityCoords(Gped)
    RequestAnimDict(Gdict)
    while not HasAnimDictLoaded(Gdict) do
        Citizen.Wait(1)
    end
    TaskPlayAnimAdvanced(Gped, Gdict, "onback_fwd", coords2, 0.0, 0.0, Gheadin - 180, 1.0, 0.5, 2000, 1, 0.0, 1, 1)
    Citizen.Wait(3000)
    Gdict = "mp_car_bomb"
    RequestAnimDict(Gdict)
    while not HasAnimDictLoaded(Gdict) do
        Citizen.Wait(1)
    end

    FreezeEntityPosition(Gveh, true)
    SetVehicleFixed(Gvehicle)
    SetVehicleDeformationFixed(Gvehicle)
    SetVehicleUndriveable(Gvehicle, false)
    SetVehicleEngineOn(Gvehicle, true, true)
    ClearPedTasksImmediately(PlayerPedId())

    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1250, 1, 0.0, 1, 1)
    Citizen.Wait(1250)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.4, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.3, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.2, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.15, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.1, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.05, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.025, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Gdict = "move_crawl"
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z + 0.01, true, true, true)
    TaskPlayAnimAdvanced(Gped, Gdict, "car_bomb_mechanic", Gcoords, 0.0, 0.0, Gheadin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    SetEntityCoordsNoOffset(Gveh, Gvehpos.x, Gvehpos.y, Gvehpos.z, true, true, true)
    FreezeEntityPosition(Gveh, false)
    Citizen.Wait(100)
    DetachEntity(Gvehjack, true, false)
    SetEntityCollision(Gvehjack, false, false)
    DeleteEntity(Gvehjack)

    SetEntityCollision(Gveh, true, true)
    Gfinishready = false
    exports["soz-hud"]:DrawNotification("Véhicule libéré")
end

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
                ApplyWheel(v.wheelID, n.id, v.id)
            end,
        })
    end
    local eventwheelon = menu:On("switch", function(item, currentItem, prevItem)
        PreviewWheel(v.wheelID, currentItem.Value, v.id)
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
        label = "Roues",
        select = function()
            menu:Close()
        end,
    })
    local currentCustomWheelState = GetCurrentCustomWheelState()
    if currentCustomWheelState == 0 then
        menu:AddButton({label = "Désactiver", rightLabel = "~g~Installé", description = ""})
        menu:AddButton({
            label = "Activer",
            description = "Améliorer 🔧",
            select = function()
                menu:Close()
                ApplyCustomWheel(1)
            end,
        })
    else
        menu:AddButton({
            label = "Désactiver",
            description = "Améliorer 🔧",
            select = function()
                menu:Close()
                ApplyCustomWheel(0)
            end,
        })
        menu:AddButton({label = "Activer", rightLabel = "~g~Installé", description = ""})
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
            menu:AddButton({label = v.name, rightLabel = "~g~Installé"})
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
        RestoreOriginalColours()
    end)
end

local function OpenResprayTypeMenu(menu, colorcat)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Catégories de couleur",
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
        label = "Couleur Principale",
        select = function()
            OpenResprayTypeMenu(ResprayTypeMenu, 0)
        end,
    })
    menu:AddButton({
        label = "Couleur Secondaire",
        select = function()
            OpenResprayTypeMenu(ResprayTypeMenu, 1)
        end,
    })
    menu:AddButton({
        label = "Couleur Nacré",
        select = function()
            OpenResprayTypeMenu(ResprayTypeMenu, 2)
        end,
    })
    menu:AddButton({
        label = "Couleur des Roues",
        select = function()
            OpenResprayTypeMenu(ResprayTypeMenu, 3)
        end,
    })
    menu:AddButton({
        label = "Couleur du Tableau de bord",
        select = function()
            OpenResprayTypeMenu(ResprayTypeMenu, 4)
        end,
    })
    menu:AddButton({
        label = "Couleur Intérieure",
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
        label = "Menu Néons",
        select = function()
            menu:Close()
        end,
    })
    for k, v in ipairs(Config.vehicleNeonOptions.neonColours) do
        if currentNeonR == Config.vehicleNeonOptions.neonColours[k].r and currentNeonG == Config.vehicleNeonOptions.neonColours[k].g and currentNeonB ==
            Config.vehicleNeonOptions.neonColours[k].b then
            menu:AddButton({label = v.name, rightLabel = "~g~Installé", value = k})
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
        label = "Menu Néons",
        select = function()
            menu:Close()
        end,
    })
    if currentNeonState == 0 then
        menu:AddButton({label = "Désactiver ~g~- Installé", value = 0})
        menu:AddButton({
            label = "Activer",
            value = 1,
            description = "Améliorer 🔧",
            select = function()
                menu:Close()
                ApplyNeon(v.id, 1)
            end,
        })
    else
        menu:AddButton({
            label = "Désactiver",
            value = 0,
            description = "Améliorer 🔧",
            select = function()
                menu:Close()
                ApplyNeon(v.id, 0)
            end,
        })
        menu:AddButton({label = "Activer", rightLabel = "~g~Installé", value = 1})
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
            description = "Activer ou Désactiver Néon",
            select = function()
                OpenNeonStateMenu(NeonStateMenu, v, k)
            end,
        })
    end
    menu:AddButton({
        label = "Couleurs de Néon",
        description = "",
        select = function()
            OpenNeonColoursMenu(NeonColoursMenu)
        end,
    })
end

local function OpenXenonsHeadlightsMenu(menu)
    menu:ClearItems()
    MenuV:OpenMenu(menu)
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        select = function()
            menu:Close()
        end,
    })
    local currentXenonState = GetCurrentXenonState()
    if currentXenonState == 0 then
        menu:AddButton({label = "Désactiver Xénons", rightLabel = "~g~Installé"})
        menu:AddButton({
            label = "Activer Xénons",
            description = "Améliorer 🔧",
            select = function()
                menu:Close()
                ApplyXenonLights(22, 1)
            end,
        })
    else
        menu:AddButton({
            label = "Désactiver Xenons",
            description = "Améliorer 🔧",
            select = function()
                menu:Close()
                ApplyXenonLights(22, 0)
            end,
        })
        menu:AddButton({label = "Activer Xénons", rightLabel = "~g~Installé"})
    end
    menu:On("close", function()
        menu:Close()
        menu:ClearItems()
    end)
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
            menu:AddButton({label = v.name, rightLabel = "~g~Installé", value = v.id})
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
            menu:AddButton({label = n.name, rightLabel = "~g~Installé", value = n.id})
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
    local plyVeh = Config.AttachedVehicle
    local livCount = GetVehicleLiveryCount(plyVeh)
    if livCount > 0 then
        local tempOldLivery = GetVehicleLivery(plyVeh)
        if GetVehicleClass(plyVeh) ~= 18 then
            for i = 0, GetVehicleLiveryCount(plyVeh) - 1 do
                if tempOldLivery == i then
                    menu:AddButton({label = i, rightLabel = "~g~Installé", value = i})
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
    local plyVeh = Config.AttachedVehicle
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
    local plyVeh = Config.AttachedVehicle
    local tempPlateIndex = GetVehicleNumberPlateTextIndex(plyVeh)
    local plateTypes = {"Jaune sur Noir", "Jaune sur Bleu", "Bleu sur Blanc #1", "Bleu sur Blanc #2"}
    if GetVehicleClass(plyVeh) ~= 18 then
        for i = 0, #plateTypes - 1 do
            if i ~= 4 then
                if tempPlateIndex == i then
                    menu:AddButton({label = plateTypes[i + 1], rightLabel = "~g~Installé", value = i + 1})
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
            TriggerEvent("soz-bennys:client:CallRepairPart", part)
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
                elseif percentage == 100 then
                    percentage = math.round(percentage)
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
                elseif percentage == 100 then
                    percentage = math.round(percentage)
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
    local veh = Config.AttachedVehicle
    local isMotorcycle = GetVehicleClass(veh) == 8 -- Moto
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
        label = "Peinture",
        select = function()
            OpenResprayMenu(ResprayMenu)
        end,
    })
    if not isMotorcycle then
        menu:AddButton({
            label = "Teinte Fenêtre",
            select = function()
                OpenWindowTintMenu(WindowTintMenu)
            end,
        })
        menu:AddButton({
            label = "Néons",
            select = function()
                OpenNeonsMenu(NeonsMenu)
            end,
        })
    end
    menu:AddButton({
        label = "Xénons",
        select = function()
            OpenXenonsHeadlightsMenu(XenonsHeadlightsMenu)
        end,
    })
    menu:AddButton({
        label = "Roues",
        select = function()
            OpenWheelsMenu(WheelsMenu, isMotorcycle)
        end,
    })
    menu:AddButton({
        label = "Livrée de base",
        select = function()
            OpenOldLiveryMenu(OldLiveryMenu)
        end,
    })
    menu:AddButton({
        label = "Immatriculation",
        select = function()
            OpenPlateIndexMenu(PlateIndexMenu)
        end,
    })
    menu:AddButton({
        label = "Autres",
        select = function()
            OpenExtrasMenu(ExtrasMenu)
        end,
    })
end

local function saveVehicle()
    local veh = Config.AttachedVehicle
    local myCar = QBCore.Functions.GetVehicleProperties(veh)
    TriggerServerEvent("updateVehicle", myCar)
end

local function OpenMenu(menu)
    local veh = Config.AttachedVehicle
    FreezeEntityPosition(veh, true)
    menu:AddButton({
        icon = "◀",
        label = "Libérer le véhicule",
        description = "Détacher le véhicule de la plateforme",
        select = function()
        if Gready == true then
            TriggerEvent("soz-bennys:client:UnattachVehicle")
            Gfinishready = true
            menu:Close()
            finishAnimation()
            saveVehicle()
            SetVehicleDoorsLocked(veh, 1)
        else
            exports["soz-hud"]:DrawNotification("Veuillez attendre de monter le clic avant de le redescendre", "error")
        end
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
    menu:On("close", function()
        if Gready == true then
            Gready = false
            menu:Close()
        else
            exports["soz-hud"]:DrawNotification("Veuillez libérer le véhicule avant de partir", "error")
            menu:Open()
        end
    end)
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


local function startAnimation()
    local veh = Config.AttachedVehicle
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    local dict
    local model = "prop_carjack"
    local offset = GetOffsetFromEntityInWorldCoords(ped, 0.0, -2.0, 0.0)
    local headin = GetEntityHeading(ped)

    local vehicle = veh
    FreezeEntityPosition(veh, true)
    local vehpos = GetEntityCoords(veh)
    dict = "mp_car_bomb"
    RequestAnimDict(dict)
    RequestModel(model)
    while not HasAnimDictLoaded(dict) or not HasModelLoaded(model) do
        Citizen.Wait(1)
    end
    local vehjack = CreateObject(GetHashKey(model), vehpos.x, vehpos.y, vehpos.z - 0.5, true, true, true)
    AttachEntityToEntity(vehjack, veh, 0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, false, false, false, false, 0, true)

    GenerateOpenMenu()
    TaskTurnPedToFaceEntity(ped, veh, 500)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1250, 1, 0.0, 1, 1)
    Citizen.Wait(1250)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.01, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.025, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.05, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.1, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.15, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.2, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.3, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    dict = "move_crawl"
    Citizen.Wait(1000)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.4, true, true, true)
    TaskPlayAnimAdvanced(ped, dict, "car_bomb_mechanic", coords, 0.0, 0.0, headin, 1.0, 0.5, 1000, 1, 0.25, 1, 1)
    SetEntityCoordsNoOffset(veh, vehpos.x, vehpos.y, vehpos.z + 0.5, true, true, true)
    SetEntityCollision(veh, false, false)
    TaskPedSlideToCoord(ped, offset, headin, 1000)
    Citizen.Wait(1000)

    RequestAnimDict(dict)
    while not HasAnimDictLoaded(dict) do
        Citizen.Wait(100)
    end
    TaskPlayAnimAdvanced(ped, dict, "onback_bwd", coords, 0.0, 0.0, headin - 180, 1.0, 0.5, 3000, 1, 0.0, 1, 1)
    dict = "amb@world_human_vehicle_mechanic@male@base"
    Citizen.Wait(1000)
    RequestAnimDict(dict)
    while not HasAnimDictLoaded(dict) do
        Citizen.Wait(1)
    end

    Gveh = veh
    FreezeEntityPosition(Gveh, true)
    while Gfinishready == false do
        TaskPlayAnim(ped, dict, "base", 8.0, -8.0, 710, 1, 0, false, false, false)
        Citizen.Wait(700)
        Gveh = veh
        Gped = ped
        Gcoords = coords
        Gdict = dict
        Gheadin = headin
        Gvehicle = vehicle
        Gvehpos = vehpos
        Gvehjack = vehjack
        Gready = true
    end
end

---------------
-- POLYZONES --
---------------

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

Vehiclemecha1 = BoxZone:Create(vector3(-222.49, -1323.6, 30.89), 9, 6, {
    name = "Vehiclemecha1_z",
    heading = 90,
    minZ = 29.89,
    maxZ = 33.89,
})

Vehiclemecha2 = BoxZone:Create(vector3(-222.62, -1330.24, 30.89), 9, 6, {
    name = "Vehiclemecha2_z",
    heading = 90,
    minZ = 29.89,
    maxZ = 33.89,
})

Changemecha:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
    if isPointInside then
        exports["qb-target"]:AddTargetModel(-2094907124, {
            options = {
                {
                    type = "client",
                    event = "soz-bennys:client:OpenCloakroomMenu",
                    icon = "fas fa-tshirt",
                    label = "Se changer",
                    action = function()
                        TriggerEvent("soz-bennys:client:OpenCloakroomMenu")
                    end,
                    canInteract = function()
                        return OnDuty
                    end,
                    job = "bennys",
                },
            },
            distance = 2.5,
        })
    else
        if OnDuty == true and PlayerJob.id == "bennys" then
            exports["qb-target"]:RemoveTargetModel(-2094907124, "Service")
        end
    end
end)

Dutymecha:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
    if isPointInside then
        exports["qb-target"]:AddTargetModel(-1830645735, {
            options = {
                {
                    type = "client",
                    event = "QBCore:ToggleDuty",
                    icon = "fas fa-sign-in-alt",
                    label = "Prendre son service",
                    action = function(entity)
                        TriggerServerEvent("QBCore:ToggleDuty")
                    end,
                    canInteract = function()
                        return not OnDuty
                    end,
                    job = "bennys",
                },
                {
                    type = "client",
                    event = "QBCore:ToggleDuty",
                    icon = "fas fa-sign-in-alt",
                    label = "Finir son service",
                    action = function(entity)
                        TriggerServerEvent("QBCore:ToggleDuty")
                    end,
                    canInteract = function()
                        return OnDuty
                    end,
                    job = "bennys",
                },
            },
            distance = 2.5,
        })
    else
        if PlayerJob.id == "bennys" then
            exports["qb-target"]:RemoveTargetModel(-1830645735, "Service")
        end
    end
end)

Insidemecha = false

Vehiclemecha1:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
    if isPointInside then
        if OnDuty == true and PlayerJob.id == "bennys" then
            if Config.AttachedVehicle == nil then
                if IsPedInAnyVehicle(PlayerPedId()) then
                    local veh = GetVehiclePedIsIn(PlayerPedId())
                    if not IsThisModelABicycle(GetEntityModel(veh)) then
                        Insidemecha = true
                    else
                        exports["soz-hud"]:DrawNotification("Vous ne pouvez pas mette de vélos", "error")
                    end
                end
            end
        end
    else
        if OnDuty == true and PlayerJob.id == "bennys" then
            Insidemecha = false
            VehiculeOptions:Close()
            Config.AttachedVehicle = nil
        end
    end
end)

Vehiclemecha2:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
    if isPointInside then
        if OnDuty == true and PlayerJob.id == "bennys" then
            if Config.AttachedVehicle == nil then
                if IsPedInAnyVehicle(PlayerPedId()) then
                    local veh = GetVehiclePedIsIn(PlayerPedId())
                    if not IsThisModelABicycle(GetEntityModel(veh)) then
                        Insidemecha = true
                    else
                        exports["soz-hud"]:DrawNotification("Vous ne pouvez pas mette de vélos", "error")
                    end
                end
            end
        end
    else
        if OnDuty == true and PlayerJob.id == "bennys" then
            Insidemecha = false
            VehiculeOptions:Close()
            Config.AttachedVehicle = nil
        end
    end
end)

CreateThread(function()
    exports["qb-target"]:AddGlobalVehicle({
        options = {
            {
                type = "client",
                icon = "c:mechanic/nettoyer.png",
                label = "Modifier",
                action = function(entity)
                    Config.AttachedVehicle = entity
                    TriggerServerEvent("qb-vehicletuning:server:SetAttachedVehicle", entity)
                    SetVehicleDoorsLocked(entity, 4)
                    startAnimation()
                end,
                canInteract = function(entity, distance, data)
                    return Insidemecha
                end,
            },
        },
        distance = 3.0,
    })
end)
