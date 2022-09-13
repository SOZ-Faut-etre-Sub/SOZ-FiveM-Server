FfsJob = {}
FfsJob.MenuState = {}
FfsJob.Menu = MenuV:CreateMenu(nil, "", "menu_job_ffs", "soz", "ffs:menu")

RegisterNetEvent("jobs:client:ffs:OpenCloakroomMenu", function()
    SozJobCore.Functions.OpenCloakroomMenu(FfsJob.Menu, FfsConfig.Cloakroom)
end)

--AddEventHandler("soz-jobs:client:ffs:OpenSocietyMenu", function(data)
--    if FfsJob.Menu.IsOpen then
--        return
--    end
--
--    FfsJob.Menu:ClearItems()
--
--    FfsJob.Menu:AddCheckbox({
--        label = "Afficher la récolte de balle de coton",
--        value = FfsJob.MenuState.ffs_cotton_bale,
--        change = function(_, value)
--            FfsJob.MenuState.ffs_cotton_bale = value
--            if not QBCore.Functions.GetBlip("ffs_cotton_bale") then
--                QBCore.Functions.CreateBlip("ffs_cotton_bale", {
--                    name = "Point de récolte de balle de coton",
--                    coords = vector3(2564.11, 4680.59, 34.08),
--                    sprite = 808,
--                    scale = 1.0,
--                })
--            end
--
--            QBCore.Functions.HideBlip("ffs_cotton_bale", not value)
--        end,
--    })
--
--    FfsJob.Menu:Open()
--end)
