local Translations = {
    error = {
        ["failed_notification"] = "Echoué!",
        ["not_near_veh"] = "Vous n'êtes pas pret d'un véhicule!",
        ["out_range_veh"] = "Vous êtes trop loin d'un véhicule!",
        ["inside_veh"] = "Vous ne pouvez pas réparer le moteur depuis l'intérieur du véhicule!",
        ["healthy_veh"] = "Votre véhicule est en trop bon état et nécessite de meilleurs outil pour être réparer!",
        ["inside_veh_req"] = "Vous devez être dans un véhicule pour le réparer!",
        ["roadside_avail"] = "De l'assistance routière est disponible appeler les via votre téléphone!",
        ["no_permission"] = "Vous n'avez pas la permission de réparer les véhicules",
        ["fix_message"] = "%{message}, Maintenant aller dans un garage!",
        ["veh_damaged"] = "Votre véhicule est trop endomagé!",
        ["nofix_message_1"] = "Nous avons regarder votre niveau d'huile, et ils ont l'air normal",
        ["nofix_message_2"] = "Nous avons regarder votre moto, et rien n'a l'air cassé",
        ["nofix_message_3"] = "Vous avez regardé le scotch sur le tuyau d'huile et il vous avez semblé en bon état",
        ["nofix_message_4"] = "Vous avez monter le son de la radio. Le bruit bizzare du moteur à disparu",
        ["nofix_message_5"] = "Le dissolvant de rouille que vous avez utilisé n'a eu aucun effet",
        ["nofix_message_6"] = "N'essayez jamais de réparer quelque chose de cassé, mais vous n'avez pas écouté",
    },
    success = {
        ["cleaned_veh"] = "Vehicule néttoyé!",
        ["repaired_veh"] = "Vehicule réparé!",
        ["fix_message_1"] = "Vous avez vérifié le niveau d'huile",
        ["fix_message_2"] = "Vous avez fermé la fuite d'huile avec du chewing gum",
        ["fix_message_3"] = "Vous avez réparé le tuyau d'huile avec du scotch",
        ["fix_message_4"] = "Vous avez temporairement arreter la fuite d'huile",
        ["fix_message_5"] = "Vous avez mis un coup a votre moto et elle remarche !",
        ["fix_message_6"] = "Vous avez retirer de la rouille",
        ["fix_message_7"] = "Vous avez crié a votre voiture et elle remarche !",
    },
    progress = {
        ["clean_veh"] = "Vous nettoyez la voiture...",
        ["repair_veh"] = "Vous réparez la voiture..",

    }
}
Lang = Locale:new({phrases = Translations, warnOnMissing = true})
