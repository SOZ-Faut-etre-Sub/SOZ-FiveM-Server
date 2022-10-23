CreateThread(function()
    RequestModel("u_m_y_zombie_01")
end)

if GetConvarInt("feature_halloween", 0) == 1 then
    AddEventHandler("populationPedCreating", function(_, _, _, _, setters)
            setters.setModel("u_m_y_zombie_01")
    end)
end
