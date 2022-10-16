FfsJob = {}
FfsJob.MenuState = {}
FfsJob.Menu = MenuV:CreateMenu(nil, "", "menu_job_ffs", "soz", "ffs:menu")

RegisterNetEvent("jobs:client:ffs:OpenCloakroomMenu", function(storageId)
    SozJobCore.Functions.OpenCloakroomMenu(FfsJob.Menu, FfsConfig.Cloakroom, storageId)
end)
