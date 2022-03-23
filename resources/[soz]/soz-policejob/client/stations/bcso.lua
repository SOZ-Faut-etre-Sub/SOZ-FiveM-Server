--- Register Menu
CreateThread(function()
    PoliceJob.Menus["bcso"] = {
        menu = MenuV:CreateMenu(nil, "", "menu_job_bcso", "soz", "bcso:menu"),
        societyNumber = "555-BCSO",
    }
end)

--- Register Targets
CreateThread(function()
    exports["qb-target"]:AddBoxZone("bcso:duty", vector3(-450.635925, 6012.933594, 31.592176), 0.47, 0.47,
                                    {name = "bcso:duty", heading = 65.0, minZ = 31.492176, maxZ = 32.1},
                                    {options = PoliceJob.Functions.GetDutyAction("bcso"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("bcso:cloakroom", vector3(-438.71, 5990.6, 31.72), 4.4, 6.6,
                                    {name = "bcso:cloakroom", heading = 315, minZ = 30.72, maxZ = 33.72},
                                    {options = PoliceJob.Functions.GetCloakroomAction("bcso"), distance = 2.5})
end)
