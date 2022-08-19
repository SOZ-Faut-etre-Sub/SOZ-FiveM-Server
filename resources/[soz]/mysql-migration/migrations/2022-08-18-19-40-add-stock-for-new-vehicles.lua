table.insert(migrations, {
    name = "add-stock-for-new-vehicles",
    queries = {
        [[
            INSERT INTO concess_storage (model, stock, category) VALUES
                ('issi7', 6, 'Compacts'),
                ('asbo', 6, 'Compacts'),
                ('kanjo', 6, 'Compacts'),
                ('issi3', 6, 'Compacts'),
                ('brioso2', 6, 'Compacts'),
                ('dilettante', 6, 'Compacts'),
                ('rhapsody', 6, 'Compacts'),
                ('weevil', 6, 'Compacts'),
                ('sentinel3', 6, 'Coupes'),
                ('oracle', 6, 'Coupes'),
                ('previon', 6, 'Coupes'),
                ('buffalo4', 6, 'Muscle'),
                ('gauntlet3', 6, 'Muscle'),
                ('gauntlet4', 6, 'Muscle'),
                ('gauntlet5', 6, 'Muscle'),
                ('ellie', 6, 'Muscle'),
                ('dominator3', 6, 'Muscle'),
                ('dominator7', 6, 'Muscle'),
                ('dominator8', 6, 'Muscle'),
                ('impaler', 6, 'Muscle'),
                ('lurcher', 6, 'Muscle'),
                ('manana2', 6, 'Muscle'),
                ('ratloader2', 6, 'Muscle'),
                ('slamvan', 6, 'Muscle'),
                ('stalion', 6, 'Muscle'),
                ('clique', 6, 'Muscle'),
                ('tulip', 6, 'Muscle'),
                ('deviant', 6, 'Muscle'),
                ('vamos', 6, 'Muscle'),
                ('virgo2', 6, 'Muscle'),
                ('virgo3', 6, 'Muscle'),
                ('faction3', 6, 'Muscle'),
                ('ruiner', 6, 'Muscle'),
                ('ruiner2', 6, 'Muscle'),
                ('novak', 6, 'Suvs'),
                ('rebla', 6, 'Suvs'),
                ('patriot2', 6, 'Suvs'),
                ('toros', 6, 'Suvs'),
                ('blazer3', 6, 'Off-road'),
                ('caracara2', 6, 'Off-road'),
                ('kalahari', 6, 'Off-road'),
                ('hellion', 6, 'Off-road'),
                ('everon', 6, 'Off-road'),
                ('vagrant', 6, 'Off-road'),
                ('outlaw', 6, 'Off-road'),
                ('freecrawler', 6, 'Off-road'),
                ('rancherxl', 6, 'Off-road'),
                ('sandking2', 6, 'Off-road'),
                ('yosemite3', 6, 'Off-road'),
                ('asterope', 6, 'Sedans'),
                ('cog55', 6, 'Sedans'),
                ('glendale2', 6, 'Sedans'),
                ('ingot', 6, 'Sedans'),
                ('primo', 6, 'Sedans'),
                ('stafford', 6, 'Sedans'),
                ('stanier', 6, 'Sedans'),
                ('stratum', 6, 'Sedans'),
                ('tailgater2', 6, 'Sedans'),
                ('warrener2', 6, 'Sedans'),
                ('baller3', 6, 'Suvs'),
                ('baller4', 6, 'Suvs'),
                ('bjxl', 6, 'Suvs'),
                ('granger2', 6, 'Suvs'),
                ('habanero', 6, 'Suvs'),
                ('landstalker2', 6, 'Suvs'),
                ('seminole2', 6, 'Suvs'),
                ('serrano', 6, 'Suvs'),
                ('stryder', 6, 'Motorcycles'),
                ('diablous', 6, 'Motorcycles'),
                ('diablous2', 6, 'Motorcycles'),
                ('fcr', 6, 'Motorcycles'),
                ('fcr2', 6, 'Motorcycles'),
                ('speedo', 6, 'Vans'),
                ('minivan2', 6, 'Vans'),
                ('rumpo3', 6, 'Vans'),
                ('journey', 6, 'Vans')
            ;
        ]],
    },
})
