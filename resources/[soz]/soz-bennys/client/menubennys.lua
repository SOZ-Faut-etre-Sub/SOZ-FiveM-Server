local QBCore = exports["qb-core"]:GetCoreObject()

local VehiculeOptions = MenuV:CreateMenu(nil, "Station entretien", "menu_job_bennys", "soz", "mechanic:vehicle:options")
local Status = MenuV:InheritMenu(VehiculeOptions, "Etat")
local VehiculeCustom = MenuV:InheritMenu(VehiculeOptions, "Personnalisation")
local NoDamage = MenuV:InheritMenu(Status, "Aucun dommage")
local PartMenu = MenuV:InheritMenu(Status, "Menu pièces")
local SpoilersMenu = MenuV:InheritMenu(VehiculeCustom, "Choisir un mod")
local ExtrasMenu = MenuV:InheritMenu(VehiculeCustom, "Personnalisations autres")
local WindowTintMenu = MenuV:InheritMenu(VehiculeCustom, "Teinture Fenêtre")
local OldLiveryMenu = MenuV:InheritMenu(VehiculeCustom, "Sticker de base")
local PlateIndexMenu = MenuV:InheritMenu(VehiculeCustom, "Immatriculation")

local ResprayMenu = MenuV:InheritMenu(VehiculeCustom, "Peinture")
local ResprayTypeMenu = MenuV:InheritMenu(ResprayMenu, "Type de Peinture")
local ResprayColoursMenu = MenuV:InheritMenu(ResprayMenu, "Couleurs de Peinture")

local NeonsMenu = MenuV:InheritMenu(VehiculeCustom, "Néons")
local NeonStateMenu = MenuV:InheritMenu(NeonsMenu, "Etat du Néon")
local NeonColoursMenu = MenuV:InheritMenu(NeonsMenu, "Couleur des Néons")

local XenonsHeadlightsMenu = MenuV:InheritMenu(VehiculeCustom, "Xénons")

local WheelsMenu = MenuV:InheritMenu(VehiculeCustom, "Roues")
local TyreSmokeMenu = MenuV:InheritMenu(WheelsMenu, "Fumée de roue")
local CustomWheelsMenu = MenuV:InheritMenu(WheelsMenu, "Roues personnalisées")
local ChooseWheelMenu = MenuV:InheritMenu(WheelsMenu, "Choix de roue")

local variableChoosewheel
local variableisMotorcycle
local variablecatrespray
local variableRespraytype
local variableNeonstate
local variableSpoilers
local variablePart
local modified = false
Gready = false
Gfinishready = false

local function setModified(bool)
    modified = bool
end

exports("setModified", setModified)

ChooseWheelMenu:On("open", function(menu)
    local v = variableChoosewheel
    menu:ClearItems()
    menu:AddTitle({label = "Choix de roue"})
    menu:AddButton({
        icon = "◀",
        label = "Roues",
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
    ChooseWheelMenu:ClearItems()
end)

CustomWheelsMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Roues personalisées"})
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

CustomWheelsMenu:On("close", function()
    CustomWheelsMenu:ClearItems()
end)

TyreSmokeMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Fumée de roue"})
    menu:AddButton({
        icon = "◀",
        label = "Roues",
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

TyreSmokeMenu:On("close", function()
    TyreSmokeMenu:ClearItems()
end)

WheelsMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Roues"})
    menu:AddButton({
        icon = "◀",
        label = "Customisation",
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

WheelsMenu:On("close", function()
    WheelsMenu:ClearItems()
end)

ResprayColoursMenu:On("open", function(menu)
    local v = variablecatrespray
    local colorcat = variableRespraytype
    menu:ClearItems()
    menu:AddTitle({label = variablecatrespray.category})
    menu:AddButton({
        icon = "◀",
        label = "Couleur",
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
    ResprayColoursMenu:ClearItems()
    RestoreOriginalColours()
end)

ResprayTypeMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Couleur"})
    menu:AddButton({
        icon = "◀",
        label = "Peinture",
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

ResprayTypeMenu:On("close", function()
    ResprayTypeMenu:ClearItems()
end)

ResprayMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Peinture"})
    menu:AddButton({
        icon = "◀",
        label = "Customisation",
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

ResprayMenu:On("close", function()
    ResprayMenu:ClearItems()
end)

NeonColoursMenu:On("open", function(menu)
    local currentNeonR, currentNeonG, currentNeonB = GetCurrentNeonColour()
    menu:ClearItems()
    menu:AddTitle({label = "Couleurs de Néon"})
    menu:AddButton({
        icon = "◀",
        label = "Néons",
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
    NeonColoursMenu:ClearItems()
    RestoreOriginalNeonColours()
end)

NeonStateMenu:On("open", function(menu)
    local v = variableNeonstate
    local currentNeonState = GetCurrentNeonState(v.id)
    menu:ClearItems()
    menu:AddTitle({label = "Etat du Néon"})
    menu:AddButton({
        icon = "◀",
        label = "Néons",
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
    NeonStateMenu:ClearItems()
end)

NeonsMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Néons"})
    menu:AddButton({
        icon = "◀",
        label = "Customisation",
        value = VehiculeCustom,
        select = function()
            menu:Close()
        end,
    })
    for k, v in ipairs(Config.vehicleNeonOptions.neonTypes) do
        menu:AddButton({
            label = v.name,
            value = NeonStateMenu,
            description = "Etat du Néon",
            select = function()
                variableNeonstate = v
            end,
        })
    end
    menu:AddButton({label = "Couleurs de Néon", value = NeonColoursMenu})
end)

NeonsMenu:On("close", function()
    NeonsMenu:ClearItems()
end)

XenonsHeadlightsMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Xénons"})
    menu:AddButton({
        icon = "◀",
        label = "Customisation",
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

XenonsHeadlightsMenu:On("close", function()
    XenonsHeadlightsMenu:ClearItems()
end)

WindowTintMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Teinture Fenêtre"})
    menu:AddButton({
        icon = "◀",
        label = "Customisation",
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
    WindowTintMenu:ClearItems()
    RestoreOriginalWindowTint()
end)

SpoilersMenu:On("open", function(menu)
    local v = variableSpoilers[1]
    local validMods = variableSpoilers[2]
    local currentMod = variableSpoilers[3]
    menu:ClearItems()
    menu:AddTitle({label = v.category})
    menu:AddButton({
        icon = "◀",
        label = "Customisation",
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
    SpoilersMenu:ClearItems()
    RestoreOriginalMod()
end)

OldLiveryMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Sticker de base"})
    menu:AddButton({
        icon = "◀",
        label = "Customisation",
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
    OldLiveryMenu:ClearItems()
    RestoreOldLivery()
end)

ExtrasMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Autres"})
    menu:AddButton({
        icon = "◀",
        label = "Customisation",
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

ExtrasMenu:On("close", function()
    ExtrasMenu:ClearItems()
end)

PlateIndexMenu:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Couleur Immatriculation"})
    menu:AddButton({
        icon = "◀",
        label = "Customisation",
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
    PlateIndexMenu:ClearItems()
    RestorePlateIndex()
end)

PartMenu:On("open", function(menu)
    local partName = variablePart[1]
    local part = variablePart[2]
    menu:ClearItems()
    menu:AddTitle({label = partName})
    menu:AddButton({
        icon = "◀",
        label = "Réparation",
        value = Status,
        select = function()
            menu:Close()
        end,
    })
    menu:AddButton({
        label = "Réparer " .. partName .. " 🔧",
        select = function()
            TriggerEvent("soz-bennys:client:CallRepairPart", part)
            menu:Close()
        end,
    })
end)

PartMenu:On("close", function()
    PartMenu:ClearItems()
end)

NoDamage:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = variablePart[1]})
    menu:AddButton({
        icon = "◀",
        label = "Réparation",
        value = Status,
        description = "Cette pièce n'est pas endommagée",
        select = function()
            menu:Close()
        end,
    })
end)

NoDamage:On("close", function()
    NoDamage:ClearItems()
end)

Status:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Réparation"})
    menu:AddButton({
        icon = "◀",
        label = "Menu Benny's",
        value = VehiculeOptions,
        select = function()
            menu:Close()
        end,
    })
    local condition = json.decode((Entity(Config.AttachedVehicle).state or {condition = {}}).condition)
    for k, v in pairs(Config.ValuesLabels) do
        if k == "engine" then
            local enginehealth = condition["engineHealth"] or GetVehicleEngineHealth(Config.AttachedVehicle)
            local enginepercentage = QBCore.Shared.Round(enginehealth / 10, 1)
            if enginehealth == 1000 then
                menu:AddButton({
                    label = v,
                    value = NoDamage,
                    description = "Etat: " .. enginepercentage .. "% / 100.0%",
                    select = function()
                        variablePart = {v, k}
                    end,
                })
            else
                menu:AddButton({
                    label = v,
                    value = PartMenu,
                    description = "Etat: " .. enginepercentage .. "% / 100.0%",
                    select = function()
                        variablePart = {v, k}
                    end,
                })
            end
        elseif k == "body" then
            local bodyhealth = condition["bodyHealth"] or GetVehicleBodyHealth(Config.AttachedVehicle)
            local bodypercentage = QBCore.Shared.Round(bodyhealth / 10, 1)
            if bodyhealth == 1000 then
                menu:AddButton({
                    label = v,
                    value = NoDamage,
                    description = "Etat: " .. bodypercentage .. "% / 100.0%",
                    select = function()
                        variablePart = {v, k}
                    end,
                })
            else
                menu:AddButton({
                    label = v,
                    value = PartMenu,
                    description = "Etat: " .. bodypercentage .. "% / 100.0%",
                    select = function()
                        variablePart = {v, k}
                    end,
                })
            end
        elseif k == "fuel" then
            local tankhealth = condition["tankHealth"] or GetVehiclePetrolTankHealth(Config.AttachedVehicle)
            local tankpercentage = QBCore.Shared.Round(tankhealth / 10, 1)
            if tankhealth == 1000 then
                menu:AddButton({
                    label = v,
                    value = NoDamage,
                    description = "Etat: " .. tankpercentage .. "% / 100.0%",
                    select = function()
                        variablePart = {v, k}
                    end,
                })
            else
                menu:AddButton({
                    label = v,
                    value = PartMenu,
                    description = "Etat: " .. tankpercentage .. "% / 100.0%",
                    select = function()
                        variablePart = {v, k}
                    end,
                })
            end
        end
    end
end)

Status:On("close", function()
    Status:ClearItems()
end)

VehiculeCustom:On("open", function(menu)
    local veh = Config.AttachedVehicle
    local isMotorcycle = GetVehicleClass(veh) == 8 -- Moto
    menu:ClearItems()
    menu:AddTitle({label = "Customisation"})
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
        local isDisabled = false
        if v.id == 10 then
            isDisabled = table.contains(Config.DisableRoofModificationOnVehicles, veh)
        elseif v.id == 5 then
            isDisabled = table.contains(Config.DisableArmoringModificationOnVehicles, veh)
        end
        if amountValidMods > 0 and not isDisabled then
            menu:AddButton({
                label = v.category,
                value = SpoilersMenu,
                select = function()
                    variableSpoilers = {v, validMods, currentMod}
                end,
            })
        end
    end
    menu:AddButton({label = "Peinture", value = ResprayMenu})
    if not isMotorcycle then
        menu:AddButton({label = "Teinture Fenêtre", value = WindowTintMenu})
        menu:AddButton({label = "Néons", value = NeonsMenu})
    end
    menu:AddButton({label = "Xénons", value = XenonsHeadlightsMenu})
    menu:AddButton({
        label = "Roues",
        value = WheelsMenu,
        select = function()
            variableisMotorcycle = isMotorcycle
        end,
    })
    menu:AddButton({label = "Sticker de base", value = OldLiveryMenu})
    menu:AddButton({label = "Couleur Immatriculation", value = PlateIndexMenu})
    menu:AddButton({label = "Autres", value = ExtrasMenu})
end)

VehiculeCustom:On("close", function()
    VehiculeCustom:ClearItems()
end)

local function sanitizeMods(mods)
    mods.engineHealth = nil
    mods.tireHealth = nil
    mods.tankHealth = nil
    mods.dirtLevel = nil
    mods.bodyHealth = nil
    mods.oilLevel = nil
    mods.fuelLevel = nil
    mods.windowStatus = nil
    mods.tireBurstState = nil
    mods.tireBurstCompletely = nil
    mods.doorStatus = nil
    mods.wheelWidth = nil
    mods.wheelSize = nil
    return mods
end

exports("sanitizeMods", sanitizeMods)
local function saveVehicle()
    local veh = Config.AttachedVehicle
    local netID = NetworkGetNetworkIdFromEntity(veh)
    local properties = QBCore.Functions.GetVehicleProperties(veh)
    if not QBCore.Functions.AreModsEquale(sanitizeMods(json.decode(Entity(veh).state.mods)), sanitizeMods(properties)) then
        if not QBCore.Functions.TriggerRpc("soz-garage:server:UpdateVehicleMods", netID, properties) then
            exports["soz-hud"]:DrawNotification("Le véhicule n'à pu être modifié correctement(réessayer)", "error")
        else
            exports["soz-hud"]:DrawNotification("Le véhicule a été modifié correctement", "success")
        end
    end
end

VehiculeOptions:On("open", function(menu)
    menu:ClearItems()
    menu:AddTitle({label = "Menu Benny's"})
    local veh = Config.AttachedVehicle
    FreezeEntityPosition(veh, true)
    menu:AddButton({
        icon = "◀",
        label = "Libérer le véhicule",
        description = "Détacher le véhicule de la plateforme",
        select = function()
            if Gready == true then
                Gfinishready = true
                Gready = false
                if modified then
                    saveVehicle()
                end
                TriggerEvent("soz-bennys:client:UnattachVehicle")
                SetVehicleDoorsLocked(veh, 1)
                menu:Close()
                Config.AttachedVehicle = nil
            else
                exports["soz-hud"]:DrawNotification("Veuillez attendre de monter le cric avant de le redescendre", "error")
            end
        end,
    })
    menu:AddButton({label = "Réparation", value = Status, description = "Réparer les pièces du véhicule"})
    menu:AddButton({
        label = "Customisation",
        value = VehiculeCustom,
        description = "Changer les composants du véhicule",
        select = function()
            SetVehicleModKit(veh, 0)
        end,
    })
end)

VehiculeOptions:On("close", function()
    VehiculeOptions:ClearItems()
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
    Gfinishready = false
    local vehicle = Config.AttachedVehicle
    local ped = PlayerPedId()
    local dict = "mini@repair"

    FreezeEntityPosition(vehicle, true)

    VehiculeOptions:Open()
    SetVehicleDoorsLocked(vehicle, 1)
    TaskEnterVehicle(ped, vehicle, 3500, -1, 1.0, 1, 0)
    Citizen.Wait(3500)

    RequestAnimDict(dict)
    while not HasAnimDictLoaded(dict) do
        Citizen.Wait(1)
    end

    FreezeEntityPosition(vehicle, true)
    while Gfinishready == false do
        TaskPlayAnim(ped, dict, "fixing_a_car", 3.0, 3.0, 1000, 2, 0, true, true, true)
        Gready = true
        Citizen.Wait(900)
    end
end

---------------
-- POLYZONES --
---------------

Dutymecha = BoxZone:Create(vector3(-204.9, -1337.93, 34.89), 5, 4, {
    name = "Dutymecha_z",
    heading = 0,
    minZ = 33.89,
    maxZ = 37.89,
})

local repairSpots = {
    BoxZone:Create(vector3(-222.49, -1323.6, 30.89), 9, 6, {
        name = "Vehiclemecha1_z",
        heading = 90,
        minZ = 29.89,
        maxZ = 33.89,
    }),
    BoxZone:Create(vector3(-222.62, -1330.24, 30.89), 9, 6, {
        name = "Vehiclemecha2_z",
        heading = 90,
        minZ = 29.89,
        maxZ = 33.89,
    }),
    BoxZone:Create(vector3(-168.78, -1252.58, 31.3), 6.2, 13.6, {
        name = "bennys_repair_slot2",
        heading = 0,
        minZ = 30.3,
        maxZ = 35.3,
    }),
}

StaffBennys = BoxZone:Create(vector3(-1666.83, -3149.29, 13.99), 9, 6, {
    name = "staff_bennys",
    heading = 240,
    minZ = 12.3,
    maxZ = 27,
})

Dutymecha:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, _)
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
            exports["qb-target"]:RemoveTargetModel(-1830645735, "Prendre son service")
        end
    end
end)

local InsideWorkshop = false

for _, repairSpot in pairs(repairSpots) do
    repairSpot:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, _)
        if isPointInside then
            if OnDuty == true and PlayerJob.id == "bennys" then
                if Config.AttachedVehicle == nil then
                    if IsPedInAnyVehicle(PlayerPedId()) then
                        local veh = GetVehiclePedIsIn(PlayerPedId())
                        if not IsThisModelABicycle(GetEntityModel(veh)) then
                            InsideWorkshop = true
                        else
                            exports["soz-hud"]:DrawNotification("Vous ne pouvez pas mettre de vélos", "error")
                        end
                    end
                end
            end
        else
            if OnDuty == true and PlayerJob.id == "bennys" then
                InsideWorkshop = false
                VehiculeOptions:Close()
                Config.AttachedVehicle = nil
            end
        end
    end)
end

StaffBennys:onPointInOut(PolyZone.getPlayerPosition, function(isPointInside, point)
    if isPointInside then
        QBCore.Functions.TriggerCallback("admin:server:isAllowed", function(isAllowed, permission)
            if isAllowed then
                if Config.AttachedVehicle == nil then
                    if IsPedInAnyVehicle(PlayerPedId()) then
                        local veh = GetVehiclePedIsIn(PlayerPedId())
                        if not IsThisModelABicycle(GetEntityModel(veh)) then
                            InsideWorkshop = true
                        else
                            exports["soz-hud"]:DrawNotification("Vous ne pouvez pas mettre de vélos", "error")
                        end
                    end
                end
            end
        end)
    else
        QBCore.Functions.TriggerCallback("admin:server:isAllowed", function(isAllowed, permission)
            if isAllowed then
                InsideWorkshop = false
                VehiculeOptions:Close()
                Config.AttachedVehicle = nil
            end
        end)
    end
end)

CreateThread(function()
    exports["qb-target"]:AddGlobalVehicle({
        options = {
            {
                type = "client",
                icon = "c:mechanic/Modifier.png",
                label = "Modifier",
                blackoutGlobal = true,
                blackoutJob = "bennys",
                action = function(entity)
                    Config.AttachedVehicle = entity
                    modified = false
                    startAnimation()
                end,
                canInteract = function()
                    return InsideWorkshop
                end,
            },
        },
        distance = 3.0,
    })
end)
