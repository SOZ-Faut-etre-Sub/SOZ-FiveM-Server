QBConfig = {}

QBConfig.MaxPlayers = GetConvarInt('sv_maxclients', 48) -- Gets max players from config file, default 48
QBConfig.DefaultSpawn = vector4(-1035.71, -2731.87, 12.86, 0.0)
QBConfig.UpdateInterval = 5 -- how often to update player data in minutes
QBConfig.StatusInterval = 5000 -- how often to check hunger/thirst status in ms

QBConfig.Money = {}
QBConfig.Money.MoneyTypes = { ['money'] = 500, ['marked_money'] = 0 }
QBConfig.Money.DontAllowMinus = { 'money', 'marked_money' } -- Money that is not allowed going in minus

QBConfig.Player = {}
QBConfig.Player.MaxWeight = 80000 -- Max weight a player can carry (currently 120kg, written in grams)
QBConfig.Player.MaxInvSlots = 30 -- Max inventory slots for a player
QBConfig.Player.HungerRate = 4.2 -- Rate at which hunger goes down.
QBConfig.Player.ThirstRate = 3.8 -- Rate at which thirst goes down.
QBConfig.Player.Bloodtypes = {
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
}

QBConfig.Server = {} -- General server config
QBConfig.Server.closed = false -- Set server closed (no one can join except people with ace permission 'qbadmin.join')
QBConfig.Server.closedReason = "Serveur en developpement" -- Reason message to display when people can't join the server
QBConfig.Server.uptime = 0 -- Time the server has been up.
QBConfig.Server.whitelist = false -- Enable or disable whitelist on the server
QBConfig.Server.pvp = true -- Enable or disable pvp on the server (Ability to shoot other players)
QBConfig.Server.discord = "" -- Discord invite link
QBConfig.Server.PermissionList = {} -- permission list

QBConfig.Notify = {}

QBConfig.Notify.NotificationStyling = {
    group = false, -- Allow notifications to stack with a badge instead of repeating
    position = "right", -- top-left | top-right | bottom-left | bottom-right | top | bottom | left | right | center
    progress = true -- Display Progress Bar
}

-- These are how you define different notification variants
-- The "color" key is background of the notification
-- The "icon" key is the css-icon code, this project uses `Material Icons` & `Font Awesome`
QBConfig.Notify.VariantDefinitions = {
    success = {
        classes = 'success',
        icon = 'done'
    },
    primary = {
        classes = 'primary',
        icon = 'info'
    },
    error = {
        classes = 'error',
        icon = 'dangerous'
    },
    police = {
        classes = 'police',
        icon = 'local_police'
    },
    ambulance = {
        classes = 'ambulance',
        icon = 'fas fa-ambulance'
    }
}
