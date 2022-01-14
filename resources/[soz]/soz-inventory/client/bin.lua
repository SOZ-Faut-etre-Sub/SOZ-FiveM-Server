local bins = {
    GetHashKey('prop_cs_bin_01_skinned')
}

exports['qb-target']:AddTargetModel(bins, {
    options = {
        {
            event = "inventory:client:requestOpenInventory",
            icon = "fas fa-dumpster",
            label = "Ouvrir la poubelle",
            invType = "bin",
            invID = '666'
        },
    },
    distance = 1.0
})
