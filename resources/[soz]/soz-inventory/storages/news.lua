Config.Storages["news_fridge"] = {
    label = "Frigo du Twitch News",
    type = "fridge",
    owner = "news",
    position = vector3(-562.00, -937.72, 32.32),
    heading = 270.0,
    offsetUpZ = 2.0,
}

Config.Storages["news_storage"] = {
    label = "Stockage du Twitch News",
    type = "storage",
    owner = "news",
    position = vector3(-556.57, -915.31, 33.22),
    size = vec2(5.0, 0.5),
    offsetUpZ = 1.5,
}

Config.Storages["news_boss_storage"] = {
    label = "Coffre patron",
    type = "boss_storage",
    owner = "news",
    position = vector3(-572.00, -939.91, 28.82),
    size = vec2(1.0, 2.5),
}

Config.Storages["news_cloakroom"] = {
    label = "Vestiaire - Twitch News",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(-568.22, -935.54, 33.76),
    size = vec2(0.65, 3.75),
    minZ = 32.76,
    maxZ = 35.76,
    heading = 90,
    targetOptions = getCloakroomTargetOptions("news", "news_cloakroom"),
}

Config.Storages["you_news_fridge"] = {
    label = "Frigo du Twitch News",
    type = "fridge",
    owner = "you-news",
    position = vector3(-1066.73, -240.50, 39.73),
    size = vec2(1.40, 2.20),
    heading = 207.15,
    offsetUpZ = 2.0,
}

Config.Storages["you_news_storage"] = {
    label = "Stockage du Twitch News",
    type = "storage",
    owner = "you-news",
    position = vector3(-1046.41, -241.90, 37.96),
    size = vec2(1.2, 6.0),
    offsetUpZ = 2.0,
    heading = 207.26,
}

Config.Storages["you_news_boss_storage"] = {
    label = "Coffre patron",
    type = "boss_storage",
    owner = "you-news",
    position = vector3(-1051.65, -233.71, 44.02),
    size = vec2(1.0, 3.0),
    heading = 209.16,
    offsetUpZ = 2.0,
}

Config.Storages["you_news_cloakroom"] = {
    label = "Vestiaire - You News",
    type = "cloakroom",
    owner = "ffs",
    position = vector3(-1040.75, -233.07, 37.96),
    size = vec2(1.0, 1.0),
    minZ = 36.96,
    maxZ = 38.96,
    heading = 293.44,
    targetOptions = getCloakroomTargetOptions("you-news", "you_news_cloakroom"),
}
