local ped_job = {
    -- adsl
    {modelHash = "s_m_y_construct_01", x = 479.17, y = -107.53, z = 63.16, rotation = 196.24, NetworkSync = true},
    -- fougere livraison
    {modelHash = "s_m_m_postal_01", x = -424.06, y = -2789.62, z = 6.4, rotation = 314.46, NetworkSync = true},
    -- temoin d'epsylon
    {modelHash = "ig_priest", x = -766.26, y = -24.39, z = 41.08, rotation = 213.06, NetworkSync = true},
    -- recolteur de métal
    {modelHash = "s_m_y_construct_02", x = -343.23, y = -1554.57, z = 25.22, rotation = 179.11, NetworkSync = true},
    -- pole emploie
    {modelHash = "cs_barry", x = 236.53, y = -409.22, z = 47.92, rotation = 341.95, NetworkSync = true},

    -- LSPD Armor
    {modelHash = "s_f_y_cop_01", x = 608.67, y = -15.94, z = 76.63, rotation = 347.54, NetworkSync = true},
    -- BCSO Armor
    {modelHash = "s_m_y_sheriff_01", x = 1859.92, y = 3690.31, z = 34.27, rotation = 54.28, NetworkSync = true},
}

Citizen.CreateThread(function()
    TriggerEvent("soz-job:client:spawn-ped", ped_job)
end)
