local bins = {GetHashKey("prop_cs_bin_01_skinned")}

exports["qb-target"]:AddTargetModel(bins, {
    options = {
        {
            label = "Fouiller",
            icon = "c:inventory/ouvrir_la_poubelle.png",
            event = "inventory:client:requestOpenInventory",
            invType = "bin",
            invID = "666",
        },
    },
    distance = 1.0,
})
