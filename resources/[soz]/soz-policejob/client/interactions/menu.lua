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

            TriggerServerEvent("npwd:sendSocietyMessage", "npwd:sendSocietyMessage:" .. GenUUID(), {
                anonymous = false,
                number = societyNumber,
                message = ("Code Rouge !!! Un agent a besoin d'aide vers %s"):format(GetStreetNameFromHashKey(street)),
                position = true,
            })
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

PoliceJob.Functions.Menu.GenerateKeyMapping = function(job)
    if not PoliceJob.Functions.Menu.MenuAccessIsValid(job) then
        return
    end

    RegisterKeyMapping("society-menu-police", ("Ouvrir le menu entreprise [%s]"):format(SozJobCore.Jobs[job].label), "keyboard", "F3")
    RegisterCommand("society-menu-police", PoliceJob.Functions.Menu.GenerateMenu(job), false)
end

PoliceJob.Functions.Menu.GenerateMenu = function(job)
    return function()
        if not PoliceJob.Functions.Menu.MenuAccessIsValid(job) then
            return
        end

        --- @type Menu
        local menu = PoliceJob.Menus[job].menu

        menu:ClearItems()

        RedAlertEntity(menu, PoliceJob.Menus[job].societyNumber)

        if PlayerData.job.onduty then
            BadgeEntity(menu)
        end

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
end

--- Menu management
CreateThread(function()
    Wait(1000)

    if PlayerData.job ~= nil then
        PoliceJob.Functions.Menu.GenerateKeyMapping(PlayerData.job.id)
    end
end)
