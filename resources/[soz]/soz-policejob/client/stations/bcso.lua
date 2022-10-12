--- Register Menu
CreateThread(function()
    PoliceJob.Menus["bcso"] = {menu = MenuV:CreateMenu(nil, "", "menu_job_bcso", "soz", "bcso:menu")}
end)

--- Register Targets
CreateThread(function()
    exports["qb-target"]:AddBoxZone("bcso:duty", vector3(1853.753052, 3688.094727, 35.412041), 0.47, 0.47,
                                    {name = "bcso:duty", heading = 65.0, minZ = 34.2, maxZ = 34.8},
                                    {options = PoliceJob.Functions.GetDutyAction("bcso"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("bcso:prisonerCloakroom", vector3(1864.93, 3681.1, 30.27), 1.0, 7.8,
                                    {name = "bcso:prisonerCloakroom", heading = 30, minZ = 29.27, maxZ = 32.27},
                                    {options = PoliceJob.Functions.GetCloakroomPrisonerAction(), distance = 2.5})
end)
