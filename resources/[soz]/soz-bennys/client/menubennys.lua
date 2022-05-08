local VehiculeOptions = MenuV:CreateMenu(nil, "Station entretien", "menu_job_depanneur", "soz", "mechanic:vehicle:options")
local Status = MenuV:InheritMenu(VehiculeOptions, "Etat")
local VehiculeCustom = MenuV:InheritMenu(VehiculeOptions, "Personnalisation")
local NoDamage = MenuV:InheritMenu(Status, "Aucun dommage")
local PartMenu = MenuV:InheritMenu(Status, "Menu pièces")
local SpoilersMenu = MenuV:InheritMenu(VehiculeCustom, "Choisir un mod")
local ExtrasMenu = MenuV:InheritMenu(VehiculeCustom, "Personnalisations autres")
local WindowTintMenu = MenuV:InheritMenu(VehiculeCustom, "Teinte Fenêtre")
local OldLiveryMenu = MenuV:InheritMenu(VehiculeCustom, "Sticker de base")
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

local variableChoosewheel
local variableisMotorcycle
local variablecatrespray
local variableRespraytype
local variableNeonstate
local variableSpoilers
local variablePart
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

ChooseWheelMenu:On("open", function(menu)
    local v = variableChoosewheel
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        value = WheelsMenu,
        select = function()
            menu:Close()
        end,
    })
    local validMods, amountValidMods = CheckValidMods(v.category, v.wheelID, v.id)
    for m, n in pairs(validMods) do
        menu:AddButton({
            label = n.name,
            description = "Améliorer 🔧",
            select = function()
                ApplyWheel(v.wheelID, n.id, v.id)
                menu:Close()
            end,
            enter = function()
                PreviewWheel(v.wheelID, n.id, v.id)
            end,
        })
    end
end)

ChooseWheelMenu:On("close", function()
    RestoreOriginalWheels()
end)

CustomWheelsMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Roues",
        value = WheelsMenu,
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
                ApplyCustomWheel(1)
                menu:Close()
            end,
        })
    else
        menu:AddButton({
            label = "Désactiver",
            description = "Améliorer 🔧",
            select = function()
                ApplyCustomWheel(0)
                menu:Close()
            end,
        })
        menu:AddButton({label = "Activer", rightLabel = "~g~Installé", description = ""})
    end
end)

TyreSmokeMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Wheels",
        value = WheelsMenu,
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
                    ApplyTyreSmoke(v.r, v.g, v.b)
                    menu:Close()
                end,
            })
        end
    end
end)

WheelsMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        value = VehiculeCustom,
        select = function()
            menu:Close()
        end,
    })
    for k, v in ipairs(Config.vehicleWheelOptions) do
        if variableisMotorcycle then
            if v.id == -1 or v.id == 20 or v.id == 6 then
                menu:AddButton({
                    label = v.category,
                    description = "",
                    select = function()
                        if v.id == 20 then
                            TyreSmokeMenu:Open()
                        elseif v.id == -1 then
                            CustomWheelsMenu:Open()
                        elseif v.id == 6 then
                            variableChoosewheel = v
                            ChooseWheelMenu:Open()
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
                        TyreSmokeMenu:Open()
                    elseif v.id == -1 then
                        CustomWheelsMenu:Open()
                    else
                        variableChoosewheel = v
                        ChooseWheelMenu:Open()
                    end
                end,
            })
        end
    end
end)

ResprayColoursMenu:On("open", function(menu)
    local v = variablecatrespray
    local colorcat = variableRespraytype
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        value = ResprayTypeMenu,
        select = function()
            menu:Close()
        end,
    })
    for m, n in ipairs(v.colours) do
        menu:AddButton({
            label = n.name,
            description = "Améliorer 🔧",
            select = function()
                ApplyColour(colorcat, v.id, n.id)
                menu:Close()
            end,
            enter = function()
                PreviewColour(colorcat, v.id, n.id)
            end,
        })
    end
end)

ResprayColoursMenu:On("close", function()
    RestoreOriginalColours()
end)

ResprayTypeMenu:On("open", function(menu)
    menu:ClearItems()
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
            value = ResprayColoursMenu,
            description = "",
            select = function()
                variablecatrespray = v
            end,
        })
    end
end)

ResprayMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        value = VehiculeCustom,
        select = function()
            menu:Close()
        end,
    })
    menu:AddButton({
        label = "Couleur Principale",
        value = ResprayTypeMenu,
        select = function()
            variableRespraytype = 0
        end,
    })
    menu:AddButton({
        label = "Couleur Secondaire",
        value = ResprayTypeMenu,
        select = function()
            variableRespraytype = 1
        end,
    })
    menu:AddButton({
        label = "Couleur Nacré",
        value = ResprayTypeMenu,
        select = function()
            variableRespraytype = 2
        end,
    })
    menu:AddButton({
        label = "Couleur des Roues",
        value = ResprayTypeMenu,
        select = function()
            variableRespraytype = 3
        end,
    })
    menu:AddButton({
        label = "Couleur du Tableau de bord",
        value = ResprayTypeMenu,
        select = function()
            variableRespraytype = 4
        end,
    })
    menu:AddButton({
        label = "Couleur Intérieure",
        value = ResprayTypeMenu,
        select = function()
            variableRespraytype = 5
        end,
    })
end)

NeonColoursMenu:On("open", function(menu)
    local currentNeonR, currentNeonG, currentNeonB = GetCurrentNeonColour()
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Menu Néons",
        value = NeonsMenu,
        select = function()
            menu:Close()
        end,
    })
    for k, v in ipairs(Config.vehicleNeonOptions.neonColours) do
        if currentNeonR == Config.vehicleNeonOptions.neonColours[k].r and currentNeonG == Config.vehicleNeonOptions.neonColours[k].g and currentNeonB ==
            Config.vehicleNeonOptions.neonColours[k].b then
            menu:AddButton({
                label = v.name,
                rightLabel = "~g~Installé",
                enter = function()
                    PreviewNeonColour(Config.vehicleNeonOptions.neonColours[k].r, Config.vehicleNeonOptions.neonColours[k].g,
                    Config.vehicleNeonOptions.neonColours[k].b)
                end,
            })
        else
            menu:AddButton({
                label = v.name,
                description = "Améliorer 🔧",
                select = function()
                    ApplyNeonColour(Config.vehicleNeonOptions.neonColours[k].r, Config.vehicleNeonOptions.neonColours[k].g,
                                    Config.vehicleNeonOptions.neonColours[k].b)
                    menu:Close()
                end,
                enter = function()
                    PreviewNeonColour(Config.vehicleNeonOptions.neonColours[k].r, Config.vehicleNeonOptions.neonColours[k].g,
                    Config.vehicleNeonOptions.neonColours[k].b)
                end,
            })
        end
    end
end)

NeonColoursMenu:On("close", function()
    RestoreOriginalNeonColours()
end)

NeonStateMenu:On("open", function(menu)
    local v = variableNeonstate
    local currentNeonState = GetCurrentNeonState(v.id)
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Menu Néons",
        value = NeonsMenu,
        select = function()
            menu:Close()
        end,
    })
    if currentNeonState == 0 then
        menu:AddButton({
            label = "Désactiver ~g~- Installé",
            enter = function()
                PreviewNeon(v.id, 0)
            end,
        })
        menu:AddButton({
            label = "Activer",
            description = "Améliorer 🔧",
            select = function()
                ApplyNeon(v.id, 1)
                menu:Close()
            end,
            enter = function()
                PreviewNeon(v.id, 1)
            end,
        })
    else
        menu:AddButton({
            label = "Désactiver",
            description = "Améliorer 🔧",
            select = function()
                ApplyNeon(v.id, 0)
                menu:Close()
            end,
            enter = function()
                PreviewNeon(v.id, 0)
            end,
        })
        menu:AddButton({
            label = "Activer",
            rightLabel = "~g~Installé",
            enter = function()
                PreviewNeon(v.id, 1)
            end,
        })
    end
end)

NeonStateMenu:On("close", function()
    RestoreOriginalNeonStates()
end)

NeonsMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        value = VehiculeCustom,
        select = function()
            menu:Close()
        end,
    })
    for k, v in ipairs(Config.vehicleNeonOptions.neonTypes) do
        menu:AddButton({
            label = v.name,
            value = NeonStateMenu,
            description = "Activer ou Désactiver Néon",
            select = function()
                variableNeonstate = k
            end,
        })
    end
    menu:AddButton({
        label = "Couleurs de Néon",
        value = NeonColoursMenu,
    })
end)

XenonsHeadlightsMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        value = VehiculeCustom,
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
                ApplyXenonLights(22, 1)
                menu:Close()
            end,
        })
    else
        menu:AddButton({
            label = "Désactiver Xenons",
            description = "Améliorer 🔧",
            select = function()
                ApplyXenonLights(22, 0)
                menu:Close()
            end,
        })
        menu:AddButton({label = "Activer Xénons", rightLabel = "~g~Installé"})
    end
end)

WindowTintMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        value = VehiculeCustom,
        select = function()
            menu:Close()
        end,
    })
    local currentWindowTint = GetCurrentWindowTint()

    for k, v in ipairs(Config.vehicleWindowTintOptions) do
        if currentWindowTint == v.id then
            menu:AddButton({
                label = v.name,
                rightLabel = "~g~Installé",
                enter = function()
                    PreviewWindowTint(v.id)
                end,
            })
        else
            menu:AddButton({
                label = v.name,
                description = "Améliorer 🔧",
                select = function()
                    ApplyWindowTint(v.id)
                    menu:Close()
                end,
                enter = function()
                    PreviewWindowTint(v.id)
                end,
            })
        end
    end
end)

WindowTintMenu:On("close", function()
    RestoreOriginalWindowTint()
end)

SpoilersMenu:On("open", function(menu)
    local v = variableSpoilers[1]
    local validMods = variableSpoilers[2]
    local currentMod = variableSpoilers[3]
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        value = VehiculeCustom,
        select = function()
            menu:Close()
        end,
    })
    for m, n in pairs(validMods) do
        if currentMod == n.id then
            menu:AddButton({
                label = n.name,
                rightLabel = "~g~Installé",
                enter = function()
                    PreviewMod(v.id, n.id)
                end,
            })
        else
            menu:AddButton({
                label = n.name,
                description = "Améliorer 🔧",
                select = function()
                    ApplyMod(v.id, n.id)
                    menu:Close()
                end,
                enter = function()
                    PreviewMod(v.id, n.id)
                end,
            })
        end
    end
end)

SpoilersMenu:On("close", function()
    RestoreOriginalMod()
end)

OldLiveryMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        value = VehiculeCustom,
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
                    menu:AddButton({
                        label = i,
                        rightLabel = "~g~Installé",
                        enter = function()
                            PreviewOldLivery(i)
                        end,
                    })
                else
                    menu:AddButton({
                        label = i,
                        description = "Améliorer 🔧",
                        select = function()
                            ApplyOldLivery(i)
                            menu:Close()
                        end,
                        enter = function()
                            PreviewOldLivery(i)
                        end,
                    })
                end
            end
        end
    end
end)

OldLiveryMenu:On("close", function()
    RestoreOldLivery()
end)

ExtrasMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        value = VehiculeCustom,
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
                        ApplyExtra(i)
                        menu:Close()
                    end,
                })
            end
        end
    end
end)

PlateIndexMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        value = VehiculeCustom,
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
                    menu:AddButton({
                        label = plateTypes[i + 1],
                        rightLabel = "~g~Installé",
                        value = i + 1,
                        enter = function()
                            PreviewPlateIndex(i + 1)
                        end,
                    })
                else
                    menu:AddButton({
                        label = plateTypes[i + 1],
                        value = i + 1,
                        description = "Améliorer 🔧",
                        select = function()
                            ApplyPlateIndex(i + 1)
                            menu:Close()
                        end,
                        enter = function()
                            PreviewPlateIndex(i + 1)
                        end,
                    })
                end
            end
        end
    end
end)

PlateIndexMenu:On("close", function()
    RestorePlateIndex()
end)

PartMenu:On("open", function(menu)
    local partName = variablePart[1]
    local part = variablePart[2]
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        value = Status,
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
end)

NoDamage:On("open", function(menu)
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Retour",
        value = Status,
        description = "Cette pièce n'est pas endommagée",
        select = function()
            menu:Close()
        end,
    })
end)

Status:On("open", function(menu)
    local plate = QBCore.Functions.GetPlate(Config.AttachedVehicle)
    menu:ClearItems()
    if VehicleStatus[plate] ~= nil then
        menu:AddButton({
            icon = "◀",
            label = "Menu Benny's",
            value = VehiculeOptions,
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
                    value = PartMenu,
                    description = "Etat: " .. percentage .. "% / 100.0%",
                    select = function()
                        variablePart = v
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
                    value = NoDamage,
                    description = "Etat: " .. percentage .. "% / 100.0%",
                })
            end
        end
    end
end)

VehiculeCustom:On("open", function(menu)
    local veh = Config.AttachedVehicle
    local isMotorcycle = GetVehicleClass(veh) == 8 -- Moto
    menu:ClearItems()
    menu:AddButton({
        icon = "◀",
        label = "Menu Benny's",
        value = VehiculeOptions,
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
                value = SpoilersMenu,
                select = function()
                    variableSpoilers = {v, validMods, currentMod}
                end,
            })
        end
    end
    menu:AddButton({
        label = "Peinture",
        value = ResprayMenu,
    })
    if not isMotorcycle then
        menu:AddButton({
            label = "Teinte Fenêtre",
            value = WindowTintMenu,
        })
        menu:AddButton({
            label = "Néons",
            value = NeonsMenu,
        })
    end
    menu:AddButton({
        label = "Xénons",
        value = XenonsHeadlightsMenu,
    })
    menu:AddButton({
        label = "Roues",
        value = WheelsMenu,
        select = function()
            variableisMotorcycle = isMotorcycle
        end,
    })
    menu:AddButton({
        label = "Sticker de base",
        value = OldLiveryMenu,
    })
    menu:AddButton({
        label = "Couleur Immatriculation",
        value = PlateIndexMenu,
    })
    menu:AddButton({
        label = "Autres",
        value = ExtrasMenu,
    })
end)

local function saveVehicle()
    local veh = Config.AttachedVehicle
    local myCar = QBCore.Functions.GetVehicleProperties(veh)
    TriggerServerEvent("updateVehicle", myCar)
end

VehiculeOptions:On("open", function(menu)
    menu:ClearItems()
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
                Gready = false
                menu:Close()
                finishAnimation()
                saveVehicle()
                SetVehicleDoorsLocked(veh, 1)
                Gfinishready = false
            else
                exports["soz-hud"]:DrawNotification("Veuillez attendre de monter le clic avant de le redescendre", "error")
            end
        end,
    })
    menu:AddButton({
        label = "Réparation du véhicule",
        value = Status,
        description = "Réparer les pièces du véhicule",
    })
    menu:AddButton({
        label = "Customisation du véhicule",
        value = VehiculeCustom,
        description = "Changer les composants du véhicule",
        select = function()
            SetVehicleModKit(veh, 0)
        end,
    })
end)

VehiculeOptions:On("close", function()
    if Gready == false and Gfinishready == false then
        exports["soz-hud"]:DrawNotification("Veuillez libérer le véhicule avant de partir", "error")
        VehiculeOptions:Open()
    elseif Gready == true then
        VehiculeOptions:Open()
    else
        VehiculeOptions:Close()
    end
end)

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

    VehiculeOptions:Open()
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
                icon = "c:mechanic/Modifier.png",
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
