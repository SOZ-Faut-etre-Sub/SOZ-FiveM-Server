local societyMenu = MenuV:CreateMenu(nil, "", "menu_job_lspd", "soz", "lspd:menu")

--- Functions

--- @param menu Menu
local function RedAlertEntity(menu)
    menu:AddButton({
        icon = "🚨",
        label = "Code Rouge",
        value = nil,
        select = function()
            local ped = PlayerPedId()
            local coords = GetEntityCoords(ped)
            local street, _ = GetStreetNameAtCoord(coords.x, coords.y, coords.z)

            TriggerServerEvent('npwd:sendSocietyMessage', 'npwd:sendSocietyMessage:'..GenUUID(), {
                anonymous = false,
                number = "555-LSPD",
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

--- Menu management
function GenerateMenu()
    societyMenu:ClearItems()
    societyMenu:SetSubtitle(string.format("%s %s", PlayerData.charinfo.firstname, PlayerData.charinfo.lastname))

    RedAlertEntity(societyMenu)

    if PlayerData.job.onduty then
        BadgeEntity(societyMenu)
    end

    if societyMenu.IsOpen then
        MenuV:CloseAll(function()
            societyMenu:Close()
        end)
    else
        MenuV:CloseAll(function()
            societyMenu:Open()
        end)
    end
end

function GenerateKeyMapping()
    RegisterKeyMapping("lspd-menu", "Ouvrir le menu entreprise [LSPD]", "keyboard", "F3")
    RegisterCommand("lspd-menu", GenerateMenu, false)
end

if PlayerData.job.id == "police" then
    GenerateKeyMapping()
end
