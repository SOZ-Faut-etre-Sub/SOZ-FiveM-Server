local ped_job = {
	-- adsl
	{modelHash = "s_m_y_construct_01"  ,x = 479.17, y = -107.53, z = 63.16, rotation = 196.24, NetworkSync = true},
	-- fougere livraison
	{modelHash = "s_m_m_postal_01"  ,x = -424.06, y = -2789.62, z = 6.4, rotation = 314.46, NetworkSync = true},
	-- temoin d'epsylon
	{modelHash = "ig_priest"  ,x = -766.26, y = -24.39, z = 41.08, rotation = 213.06, NetworkSync = true},
}

Citizen.CreateThread(function()
	TriggerEvent("soz-job:client:spawn-ped", ped_job)
end)