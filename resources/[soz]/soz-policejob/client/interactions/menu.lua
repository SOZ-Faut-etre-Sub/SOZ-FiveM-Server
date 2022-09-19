PoliceJob.Functions.Menu = {}
PoliceJob.Menus = {}

local menuState = {["radar"] = false}

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
            if not (IsWarningMessageActive() and tonumber(GetWarningMessageTitleHash()) == 1246147334) then
                TriggerEvent("police:client:RedCall")
                TriggerServerEvent("phone:sendSocietyMessage", "phone:sendSocietyMessage:" .. QBCore.Shared.UuidV4(), {
                    anonymous = false,
                    number = societyNumber,
                    message = ("Code Rouge !!! Un agent a besoin d'aide vers %s"):format(GetStreetNameFromHashKey(street)),
                    position = true,
                })
            end
        end,
    })
end

local function PropsEntity(menu)
    menu:AddSlider({
        icon = "🚧",
        label = "Poser un objet",
        value = nil,
        values = {
            {label = "Cone de circulation", value = {item = "cone", props = "prop_air_conelight", offset = -0.15}},
            {label = "Barrière", value = {item = "police_barrier", props = "prop_barrier_work05"}},
            {label = "Herse", value = {item = "spike"}},
        },
        select = function(_, value)
            if value.item == "spike" then
                TriggerServerEvent("police:server:placeSpike", value.item)
            else
                TriggerServerEvent("job:server:placeProps", value.item, value.props, value.rotation, value.offset)
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

            SetNetworkIdCanMigrate(ObjToNet(badgeProp), false)
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
                            SetBlockingOfNonTemporaryEvents(vehiclePed, true)
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
    local radarItem = menu:AddCheckbox({label = "Afficher les radars sur le GPS", value = menuState["radar"]})

    radarItem:On("change", function(menu, value)
        menuState["radar"] = value
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

--- @param menu Menu
local function WantedEntity(menu, job)
    menu:AddButton({
        icon = "👮",
        label = "Personnes recherchées",
        value = nil,
        select = function()
            menu:ClearItems()

            menu:AddButton({
                label = "Ajouter une personne à la liste",
                value = nil,
                select = function()
                    local name = exports["soz-hud"]:Input("Nom de la personne recherchée :", 125)
                    if name == nil or name == "" then
                        exports["soz-hud"]:DrawNotification("Vous devez spécifier un nom", "error")
                        return
                    end

                    TriggerServerEvent("phone:app:news:createNewsBroadcast", "phone:app:news:createNewsBroadcast:" .. QBCore.Shared.UuidV4(),
                                       {type = job, message = name})
                    menu:Close()
                end,
            })

            local wantedPlayers = QBCore.Functions.TriggerRpc("police:server:GetWantedPlayers")
            for _, wantedPlayer in pairs(wantedPlayers) do
                menu:AddButton({
                    label = wantedPlayer.message,
                    description = "Retirer la personne de la liste",
                    value = wantedPlayer.id,
                    select = function()
                        local deletion = QBCore.Functions.TriggerRpc("police:server:DeleteWantedPlayer", wantedPlayer.id)
                        if deletion then
                            exports["soz-hud"]:DrawNotification("Vous avez retiré ~b~" .. wantedPlayer.message .. " ~s~de la liste des personnes recherchées")
                            menu:Close()
                        end
                    end,
                })
            end

        end,
    })
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

    --- Interaction menu can be a submenu, so we need to ensure that something is different.
    --- If it's the case, then we can open the new menu, if not then we want to close it.
    --- The best solution could be to not use a submenu or at least change the UUID for a submenu.
    if MenuV.CurrentMenu == nil or MenuV.CurrentMenu.UUID ~= menu.UUID or MenuV.CurrentMenu.Subtitle ~= menu.Subtitle or MenuV.CurrentMenu.Items ~= menu.Items or
        not menu.IsOpen then
        MenuV:CloseAll(function()
            menu:Open()
        end)
    else
        MenuV:CloseAll(function()
            menu:Close()
        end)
    end
end

PoliceJob.Functions.Menu.GenerateJobMenu = function(job)
    PoliceJob.Functions.Menu.GenerateMenu(job, function(menu)
        if menu.IsOpen then
            menu:Close()
            return
        end
        if PlayerData.job.id == "fbi" then
            menu:AddButton({
                label = "Faire une communication",
                value = nil,
                select = function(_, value)
                    local message = exports["soz-hud"]:Input("Message de la communication", 512)
                    if message == nil or message == "" then
                        exports["soz-hud"]:DrawNotification("Vous devez spécifier un message", "error")
                        return
                    end

                    TriggerServerEvent("phone:app:news:createNewsBroadcast", "phone:app:news:createNewsBroadcast:" .. QBCore.Shared.UuidV4(), {
                        type = PlayerData.job.id,
                        message = message,
                        reporter = PlayerData.charinfo.firstname .. " " .. PlayerData.charinfo.lastname,
                        reporterId = PlayerData.citizenid,
                    })
                end,
            })
        end

        if PlayerData.job.onduty then
            RedAlertEntity(menu, "555-POLICE")
            PropsEntity(menu)
            BadgeEntity(menu)
            WantedEntity(menu, job)
            RadarEntity(menu, job)
        else
            menu:AddButton({label = "Tu n'es pas en service !", disabled = true})
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
                    exports["soz-hud"]:DrawNotification("Vous devez spécifier un title", "error")
                    return
                end

                local amount = exports["soz-hud"]:Input("Montant", 10)
                if amount == nil or tonumber(amount) == nil or tonumber(amount) <= 0 then
                    exports["soz-hud"]:DrawNotification("Vous devez spécifier un montant", "error")
                    return
                end

                local ped = PlayerPedId()
                QBCore.Functions.Progressbar("job:police:fines", "Rédaction de l'amende", 5000, false, true,
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
                        TriggerServerEvent("banking:server:sendInvoice", GetPlayerServerId(player), title, amount, "fine")
                    else
                        exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
                    end
                end)
            end,
        })

        for _, finesCategory in ipairs(Config.Fines[PlayerData.job.id]) do
            local category = MenuV:InheritMenu(menu, {Subtitle = finesCategory.label})
            menu:AddButton({label = finesCategory.label, value = category})

            for _, fine in ipairs(finesCategory.items) do
                local finePriceLabel
                if type(fine.price) == "table" then
                    finePriceLabel = ("$%d - $%d"):format(fine.price.min, fine.price.max)
                else
                    finePriceLabel = "$" .. fine.price
                end

                category:AddButton({
                    label = fine.label,
                    rightLabel = finePriceLabel,
                    select = function()
                        local ped = PlayerPedId()
                        local fineAmount
                        if type(fine.price) == "table" then
                            fineAmount = exports["soz-hud"]:Input(("Montant de l'amende ($%d - $%d)"):format(fine.price.min, fine.price.max), 10)
                            if fineAmount == nil or tonumber(fineAmount) < fine.price.min or tonumber(fineAmount) > fine.price.max then
                                exports["soz-hud"]:DrawNotification("Montant de l'amende invalide", "error")
                                return
                            end
                        else
                            fineAmount = fine.price
                        end

                        QBCore.Functions.Progressbar("job:police:fines", "Rédaction de l'amende", 5000, false, true,
                                                     {
                            disableMovement = false,
                            disableCarMovement = true,
                            disableMouse = false,
                            disableCombat = true,
                        }, {animDict = "missheistdockssetup1clipboard@base", anim = "base", flags = 1}, {
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
                                TriggerServerEvent("banking:server:sendInvoice", GetPlayerServerId(player), fine.label, fineAmount, "fine")
                            else
                                exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
                            end
                        end)
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
        local giveLicenseMenu = MenuV:InheritMenu(menu, {subtitle = "Attribuer un permis"})

        for license, value in pairs(playerLicenses) do
            if type(value) == "number" and value >= 1 then
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
                                exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
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
                        QBCore.Functions.Progressbar("job:police:license", "Retrait de points en cours...", 5000, false, true,
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
                                exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
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

        for _, license in pairs({"weapon", "hunting", "fishing"}) do
            if playerLicenses[license] then
                giveLicenseMenu:AddButton({
                    label = Config.Licenses[license].label,
                    rightLabel = "Déjà valide",
                    value = nil,
                    disabled = true,
                })
            else
                giveLicenseMenu:AddButton({
                    label = Config.Licenses[license].label,
                    value = nil,
                    select = function()
                        local ped = PlayerPedId()
                        QBCore.Functions.Progressbar("job:police:license", "Enregistrement du permis en cours...", 5000, false, true,
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
                                TriggerServerEvent("police:server:GiveLicense", GetPlayerServerId(player), license)
                            else
                                exports["soz-hud"]:DrawNotification("Personne n'est à portée de vous", "error")
                            end
                        end)

                        removeLicenseMenu:Close()
                        menu:Close()
                    end,
                })
            end
        end

        menu:AddButton({label = "Retirer des points sur un permis", value = removePointMenu})
        menu:AddButton({label = "Retirer complètement un permis", value = removeLicenseMenu})
        menu:AddButton({label = "Attribuer un permis", value = giveLicenseMenu})
    end)
end

--- Events
RegisterNetEvent("police:client:OpenSocietyMenu", function()
    if not PoliceJob.Functions.Menu.MenuAccessIsValid(PlayerData.job.id) then
        return
    end

    PoliceJob.Functions.Menu.GenerateJobMenu(PlayerData.job.id)
end)
