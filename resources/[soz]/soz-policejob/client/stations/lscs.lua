--- Register Menu
CreateThread(function()
    PoliceJob.Menus["lscs"] = {
        menu = MenuV:CreateMenu(nil, "", "menu_job_bcso", "soz", "lscs:menu"),
        societyNumber = "555-LSCS",
    }
end)

--- Register Targets
CreateThread(function()
    exports["qb-target"]:AddBoxZone("lscs:duty", vector3(-450.635925, 6012.933594, 31.592176), 0.47, 0.47,
                                    {name = "lscs:duty", heading = 65.0, minZ = 31.492176, maxZ = 32.1},
                                    {options = PoliceJob.Functions.GetDutyAction("lscs"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("lscs:cloakroom:man", vector3(626.93, 2.18, 76.63), 7.0, 8.4,
                                    {name = "lscs:cloakroom:man", heading = 350, minZ = 75.62, maxZ = 78.62},
                                    {options = PoliceJob.Functions.GetCloakroomAction("lscs"), distance = 2.5})

    exports["qb-target"]:AddBoxZone("lscs:cloakroom:woman", vector3(624.58, -5.48, 76.63), 6.8, 6.4,
                                    {name = "lscs:cloakroom:woman", heading = 350, minZ = 75.62, maxZ = 78.62},
                                    {options = PoliceJob.Functions.GetCloakroomAction("lscs"), distance = 2.5})
end)
