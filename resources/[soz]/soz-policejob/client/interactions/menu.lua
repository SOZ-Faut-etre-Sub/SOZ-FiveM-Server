PoliceJob.Functions.Menu = {}
PoliceJob.Menus = {}

--- Menu item

--- @param menu Menu
--- @param societyNumber string
local function RedAlertEntity(menu, societyNumber)
    menu:AddButton({
        icon = "🚨",
        label = "Code Rouge",
        value = nil,
        select = function()
            local ped = PlayerPedId()
            local coords = GetEntityCoords(ped)
            local street, _ = GetStreetNameAtCoord(coords.x, coords.y, coords.z)

            TriggerEvent("police:client:RedCall")
            TriggerServerEvent("npwd:sendSocietyMessage", "npwd:sendSocietyMessage:" .. QBCore.Shared.UuidV4(), {
                anonymous = false,
                number = societyNumber,
                message = ("Code Rouge !!! Un agent a besoin d'aide vers %s"):format(GetStreetNameFromHashKey(street)),
                position = true,
            })
        end,
    })
end

local function PropsEntity(menu)
    menu:AddSlider({
        icon = "🚧",
        label = "Poser un objet",
        value = nil,
        values = {
            {label = "Cone de circulation", value = {item = "cone", props = "prop_roadcone02a"}},
            {label = "Barrière", value = {item = "police_barrier", props = "prop_barrier_work05"}},
            {label = "Herse", value = {item = "spike"}},
        },
        select = function(_, value)
            if value.item == "spike" then
                TriggerServerEvent("police:server:placeSpike", value.item)
            else
                TriggerServerEvent("job:server:placeProps", value.item, value.props)
            end
        end,
    })
end

--- @param menu Menu
local function BadgeEntity(menu)
    menu:AddButton({
        label = "Montrer son badge",
        value = nil,
        select = function()
            local ped = PlayerPedId()
            local coords = GetEntityCoords(ped)
            local badgeProp = CreateObject(Config.Badge, coords.x, coords.y, coords.z + 0.2, true, true, true)
            local boneIndex = GetPedBoneIndex(ped, 28422)

            AttachEntityToEntity(badgeProp, ped, boneIndex, 0.065, 0.029, -0.035, 80.0, -1.90, 75.0, true, true, false, true, 1, true)
            QBCore.Functions.RequestAnimDict("paper_1_rcm_alt1-9")
            TaskPlayAnim(ped, "paper_1_rcm_alt1-9", "player_one_dual-9", 8.0, -8, 10.0, 49, 0, 0, 0, 0)

            CreateThread(function()
                local vehicle = QBCore.Functions.GetVehicleInDirection()
                if vehicle then
                    local pedFound = 0
                    for i = -1, GetVehicleModelNumberOfSeats(GetHashKey(vehicle)) do
                        local vehiclePed = GetPedInVehicleSeat(vehicle, i)
                        if vehiclePed ~= 0 and not IsPedAPlayer(vehiclePed) then
                            TaskLeaveVehicle(vehiclePed, vehicle, 256)
                            TaskWanderStandard(vehiclePed, 10.0, 10.0)

                            pedFound = pedFound + 1
                        end
                    end

                    if pedFound >= 1 then
                        TriggerServerEvent("vehiclekeys:server:SetVehicleOwner", QBCore.Functions.GetPlate(vehicle))
                        exports["soz-hud"]:DrawNotification("Vous venez de réquisitionner ce véhicule")

                        menu:Close()
                    end
                end
            end)

            Citizen.Wait(3000)
            ClearPedSecondaryTask(ped)
            DeleteObject(badgeProp)
        end,
    })
end

--- @param menu Menu
local function RadarEntity(menu, job)
    local radarItem = menu:AddCheckbox({label = "Afficher les radars sur le GPS"})

    radarItem:On("change", function(menu, value)
        for radarID, radar in pairs(Config.Radars) do
            if radar.station == job then
                if not QBCore.Functions.GetBlip("police_radar_" .. radarID) then
                    QBCore.Functions.CreateBlip("police_radar_" .. radarID, {
                        name = "Radar",
                        coords = radar.props,
                        sprite = 184,
                        scale = 0.5,
                    })
                end

                QBCore.Functions.HideBlip("police_radar_" .. radarID, not value)
            end
        end
    end)
end

--- Functions
PoliceJob.Functions.Menu.MenuAccessIsValid = function(job)
    if not PoliceJob.Menus[job] then
        return false
    end
    for _, allowedJob in ipairs(Config.AllowedJobInteraction) do
        if PlayerData.job.id == allowedJob then
            return true
        end
    end

    return false
end

PoliceJob.Functions.Menu.GenerateMenu = function(job, cb)
    if not PoliceJob.Functions.Menu.MenuAccessIsValid(job) then
        return
    end

    --- @type Menu
    local menu = PoliceJob.Menus[job].menu
    menu:ClearItems()

    cb(menu)

    if menu.IsOpen then
        MenuV:CloseAll(function()
            menu:Close()
        end)
    else
        MenuV:CloseAll(function()
            menu:Open()
        end)
    end
end

PoliceJob.Functions.Menu.GenerateJobMenu = function(job)
    PoliceJob.Functions.Menu.GenerateMenu(job, function(menu)
        RedAlertEntity(menu, PoliceJob.Menus[job].societyNumber)
        PropsEntity(menu)

        if PlayerData.job.onduty then
            BadgeEntity(menu)
            RadarEntity(menu, job)
        end
    end)
end

PoliceJob.Functions.Menu.GenerateInvoiceMenu = function(job, targetPlayer)
    local player = NetworkGetPlayerIndexFromPed(targetPlayer)

    PoliceJob.Functions.Menu.GenerateMenu(job, function(menu)
        menu:AddButton({
            label = "Amende personnalisée",
            value = nil,
            select = function()
                local title = exports["soz-hud"]:Input("Titre", 200)
                if title == nil or title == "" then
                    exports["soz-hud"]:DrawNotification("~r~Vous devez spécifier un title")
                    return
                end

                local amount = exports["soz-hud"]:Input("Montant", 10)
                if amount == nil or tonumber(amount) == nil or tonumber(amount) <= 0 then
                    exports["soz-hud"]:DrawNotification("~r~Vous devez spécifier un montant")
                    return
                end

                TriggerServerEvent("banking:server:sendInvoice", GetPlayerServerId(player), title, amount)
            end,
        })

        for _, finesCategory in ipairs(Config.Fines) do
            local category = MenuV:InheritMenu(menu, {Subtitle = finesCategory.label})
            menu:AddButton({label = finesCategory.label, value = category})

            for _, fine in ipairs(finesCategory.items) do
                category:AddButton({
                    label = fine.label,
                    rightLabel = "$" .. fine.price,
                    select = function()
                        TriggerServerEvent("banking:server:sendInvoice", GetPlayerServerId(player), fine.label, fine.price)
                    end,
                })
            end
        end
    end)
end

PoliceJob.Functions.Menu.GenerateLicenseMenu = function(job, targetPlayer)
    local player = NetworkGetPlayerIndexFromPed(targetPlayer)
    local playerLicenses = QBCore.Functions.TriggerRpc("police:server:getLicenses", GetPlayerServerId(player))

    PoliceJob.Functions.Menu.GenerateMenu(job, function(menu)
        local removePointMenu = MenuV:InheritMenu(menu, {subtitle = "Retirer des points"})
        local removeLicenseMenu = MenuV:InheritMenu(menu, {subtitle = "Retirer un permis"})

        for license, value in pairs(playerLicenses) do
            if type(value) == "number" and value > 1 then
                local sliderPoints = {}
                for i = 1, value do
                    sliderPoints[i] = {label = i .. " point" .. (i > 1 and "s" or ""), value = i}
                end

                removePointMenu:AddSlider({
                    label = Config.Licenses[license].label,
                    value = license,
                    values = sliderPoints,
                    select = function(item)
                        local ped = PlayerPedId()
                        QBCore.Functions.Progressbar("job:police:license", "Retrais de points en cours...", 5000, false, true,
                                                     {
                            disableMovement = false,
                            disableCarMovement = true,
                            disableMouse = false,
                            disableCombat = true,
                        }, {animDict = "missheistdockssetup1clipboard@base", anim = "base", flags = 16}, {
                            model = "prop_notepad_01",
                            bone = 18905,
                            coords = {x = 0.1, y = 0.02, z = 0.05},
                            rotation = {x = 10.0, y = 0.0, z = 0.0},
                        }, {
                            model = "prop_pencil_01",
                            bone = 58866,
                            coords = {x = 0.11, y = -0.02, z = 0.001},
                            rotation = {x = -120.0, y = 0.0, z = 0.0},
                        }, function() -- Done
                            if #(GetEntityCoords(ped) - GetEntityCoords(GetPlayerPed(player))) < 2.5 then
                                TriggerServerEvent("police:server:RemovePoint", GetPlayerServerId(player), license, item.Value)
                            else
                                exports["soz-hud"]:DrawNotification("~r~Personne n'est à portée de vous")
                            end
                        end)

                        removePointMenu:Close()
                        menu:Close()
                    end,
                })
            elseif type(value) == "number" and value == 0 then
                removePointMenu:AddButton({
                    label = Config.Licenses[license].label,
                    rightLabel = "Invalide",
                    value = nil,
                    disabled = true,
                })
            elseif type(value) == "boolean" and value then
                removeLicenseMenu:AddConfirm({
                    label = Config.Licenses[license].label,
                    value = license,
                    confirm = function(item)
                        local ped = PlayerPedId()
                        QBCore.Functions.Progressbar("job:police:license", "Retrais de points en cours...", 5000, false, true,
                                                     {
                            disableMovement = false,
                            disableCarMovement = true,
                            disableMouse = false,
                            disableCombat = true,
                        }, {animDict = "missheistdockssetup1clipboard@base", anim = "base", flags = 16}, {
                            model = "prop_notepad_01",
                            bone = 18905,
                            coords = {x = 0.1, y = 0.02, z = 0.05},
                            rotation = {x = 10.0, y = 0.0, z = 0.0},
                        }, {
                            model = "prop_pencil_01",
                            bone = 58866,
                            coords = {x = 0.11, y = -0.02, z = 0.001},
                            rotation = {x = -120.0, y = 0.0, z = 0.0},
                        }, function() -- Done
                            if #(GetEntityCoords(ped) - GetEntityCoords(GetPlayerPed(player))) < 2.5 then
                                TriggerServerEvent("police:server:RemoveLicense", GetPlayerServerId(player), license, item.Value)
                            else
                                exports["soz-hud"]:DrawNotification("~r~Personne n'est à portée de vous")
                            end
                        end)

                        removeLicenseMenu:Close()
                        menu:Close()
                    end,
                })
            elseif type(value) == "boolean" and not value then
                removeLicenseMenu:AddButton({
                    label = Config.Licenses[license].label,
                    rightLabel = "Invalide",
                    value = nil,
                    disabled = true,
                })
            end
        end

        menu:AddButton({label = "Retirer des points sur un permis", value = removePointMenu})
        menu:AddButton({label = "Retirer complètement un permis", value = removeLicenseMenu})
    end)
end

--- Events
RegisterNetEvent("police:client:OpenSocietyMenu", function()
    if not PoliceJob.Functions.Menu.MenuAccessIsValid(PlayerData.job.id) then
        return
    end

    PoliceJob.Functions.Menu.GenerateJobMenu(PlayerData.job.id)
end)
