table.insert(migrations, {
    name = "update-player-housing",
    queries = {
        [[
            UPDATE player_house SET entry_zone = '{"x": 77.85, "y": 3732.27, "z": 39.62, "sx": 0.4, "sy": 1.2, "heading": 315, "minZ": 39.37, "maxZ": 41.77}' WHERE identifier = 'v_trailer_07';
        ]],
        [[
            UPDATE player_house SET entry_zone = '{"x": 2417.84, "y": 4020.88, "z": 36.84, "sx": 1.4, "sy": 1.2, "heading": 341, "minZ": 35.89, "maxZ": 38.29}' WHERE identifier = 'north_house_low_03';
        ]],
        [[
            UPDATE player_house SET entry_zone = '{"x": 905.77, "y": 3585.74, "z": 33.42, "sx": 1.0, "sy": 1.2, "heading": 0, "minZ": 32.82, "maxZ": 34.62}' WHERE identifier = 'north_house_low_04';
        ]],
        [[
            UPDATE player_house SET entry_zone = '{"x": -405.82, "y": 6151.38, "z": 31.68, "sx": 0.6, "sy": 1.8, "heading": 46, "minZ": 30.68, "maxZ": 33.08}' WHERE identifier = 'north_house_low_05';
        ]],
        [[
            UPDATE player_house SET entry_zone = '{"x": 1682.33, "y": 4689.54, "z": 43.07, "sx": 1.2, "sy": 0.6, "heading": 0, "minZ": 42.17, "maxZ": 44.57}' WHERE identifier = 'north_house_low_08';
        ]],
        [[
            UPDATE player_house SET entry_zone = '{"x": -35.39, "y": 2872.02, "z": 59.62, "sx": 0.6, "sy": 1.4, "heading": 340, "minZ": 58.62, "maxZ": 60.82}' WHERE identifier = 'north_house_low_09';
        ]],
        [[
            UPDATE player_house SET entry_zone = '{"x": -131.46, "y": 6552.6, "z": 29.52, "sx": 1.6, "sy": 1.2, "heading": 45, "minZ": 29.32, "maxZ": 31.52}' WHERE identifier = 'north_house_mid_02';
        ]],
        [[
            UPDATE player_house SET entry_zone = '{"x": 1673.3, "y": 4658.22, "z": 44.15, "sx": 1.3, "sy": 1, "heading": 0, "minZ": 42.75, "maxZ": 44.95}' WHERE identifier = 'north_house_mid_05';
        ]],
        [[
            UPDATE player_house SET entry_zone = '{"x": 180.67, "y": 3033.09, "z": 44.21, "sx": 1.2, "sy": 1, "heading": 6, "minZ": 43.01, "maxZ": 45.41}' WHERE identifier = 'north_house_mid_07';
        ]],
        [[
            UPDATE player_house SET entry_zone = '{"x": 9.0, "y": -916.61, "z": 29.91, "sx": 2.5, "sy": 0.8, "heading": 340, "minZ": 29.11, "maxZ": 31.11}' WHERE identifier = 'soz_appartements_01';
        ]],
        [[
            UPDATE player_house SET entry_zone = '{"x": -767.53, "y": -917.05, "z": 21.08, "sx": 2.4, "sy": 2.0, "heading": 0, "minZ": 20.68, "maxZ": 23.08}' WHERE identifier = 'south_house_low_01';
        ]],
        [[
            UPDATE player_house SET entry_zone = '{"x": -19.31, "y": -1056.34, "z": 28.23, "sx": 0.8, "sy": 1.2, "heading": 340, "minZ": 27.43, "maxZ": 29.83}' WHERE identifier = 'south_house_low_04';
        ]],
        [[
            UPDATE player_house SET entry_zone = '{"x": 278.77, "y": -1117.55, "z": 29.95, "sx": 0.8, "sy": 2.0, "heading": 0, "minZ": 28.35, "maxZ": 30.75}' WHERE identifier = 'south_house_low_05';
        ]],
        [[
            UPDATE player_house SET entry_zone = '{"x": -1146.44, "y": 545.37, "z": 101.85, "sx": 1.2, "sy": 1.3, "heading": 9, "minZ": 100.85, "maxZ": 103.65}' WHERE identifier = 'soz_villa_01';
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 29.04, "y": -924.15, "z": 99.28, "sx": 1.8, "sy": 1, "heading": 340, "minZ": 98.28, "maxZ": 100.68}' WHERE id = 32;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 8.46, "y": 6575.27, "z": 32.6, "sx": 1.6, "sy": 1, "heading": 315, "minZ": 31.6, "maxZ": 34.0}' WHERE id = 22;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -429.92, "y": 6151.41, "z": 32.09, "sx": 1.0, "sy": 1.6, "heading": 315, "minZ": 31.09, "maxZ": 33.49}' WHERE id = 21;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -223.11, "y": -827.48, "z": 104.76, "sx": 1.0, "sy": 1.8, "heading": 340, "minZ": 103.66, "maxZ": 106.26}' WHERE id = 44;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -1015.28, "y": -752.64, "z": 45.45, "sx": 1.8, "sy": 1, "heading": 0, "minZ": 44.45, "maxZ": 46.85}' WHERE id = 39;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 1651.27, "y": 4779.61, "z": 42.23, "sx": 1.0, "sy": 1.6, "heading": 10, "minZ": 41.23, "maxZ": 43.63}' WHERE id = 28;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 2484.32, "y": 3443.92, "z": 44.87, "sx": 2.4, "sy": 1, "heading": 50, "minZ": 43.87, "maxZ": 46.27}' WHERE id = 12;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 274.04, "y": -1111.81, "z": 39.22, "sx": 1.0, "sy": 1.6, "heading": 0, "minZ": 38.22, "maxZ": 40.62}' WHERE id = 51;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -781.87, "y": -765.79, "z": 72.68, "sx": 1.8, "sy": 1.0, "heading": 0, "minZ": 71.68, "maxZ": 74.08}' WHERE id = 38;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 1672.76, "y": 4693.2, "z": 43.06, "sx": 1.6, "sy": 1.0, "heading": 0, "minZ": 42.06, "maxZ": 44.46}' WHERE id = 23;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 1584.38, "y": 2910.38, "z": 51.73, "sx": 2.6, "sy": 1.2, "heading": 35, "minZ": 50.73, "maxZ": 53.13}' WHERE id = 10;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -774.13, "y": -904.72, "z": 25.19, "sx": 1.6, "sy": 1, "heading": 0, "minZ": 24.19, "maxZ": 26.59}' WHERE id = 46;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 12.81, "y": 3689.97, "z": 35.42, "sx": 1.2, "sy": 2.4, "heading": 20, "minZ": 34.42, "maxZ": 36.82}' WHERE id = 6;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -46.98, "y": 6639.23, "z": 31.71, "sx": 1.6, "sy": 1, "heading": 40, "minZ": 30.56, "maxZ": 33.16}' WHERE id = 16
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 2199.58, "y": 3318.36, "z": 41.82, "sx": 2.4, "sy": 1.0, "heading": 30, "minZ": 40.82, "maxZ": 43.22}' WHERE id = 15;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 2472.86, "y": 4099.26, "z": 40.77, "sx": 1.6, "sy": 1, "heading": 335, "minZ": 39.77, "maxZ": 42.17}' WHERE id = 17;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 258.94, "y": 3174.24, "z": 43.08, "sx": 1.6, "sy": 1, "heading": 2, "minZ": 42.08, "maxZ": 44.48}' WHERE id = 30;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -277.09, "y": -722.53, "z": 109.74, "sx": 0.8, "sy": 1.8, "heading": 340, "minZ": 108.59, "maxZ": 111.19}' WHERE id = 36;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 103.17, "y": -879.81, "z": 122.26, "sx": 0.8, "sy": 1.8, "heading": 340, "minZ": 121.26, "maxZ": 123.86}' WHERE id = 42;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -367.85, "y": 6346.65, "z": 32.01, "sx": 1.6, "sy": 1, "heading": 310, "minZ": 30.86, "maxZ": 33.46}' WHERE id = 27;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -277.04, "y": -722.5, "z": 83.78, "sx": 0.8, "sy": 1.8, "heading": 340, "minZ": 82.63, "maxZ": 85.23}' WHERE id = 35;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 191.57, "y": 3033.1, "z": 44.16, "sx": 1.6, "sy": 1.0, "heading": 3, "minZ": 43.16, "maxZ": 45.56}' WHERE id = 31;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -1197.83, "y": 684.52, "z": 150.41, "sx": 1.6, "sy": 1, "heading": 335, "minZ": 149.41, "maxZ": 151.81}' WHERE id = 64;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -277.08, "y": -722.51, "z": 95.31, "sx": 1.0, "sy": 1.8, "heading": 340, "minZ": 94.31, "maxZ": 96.71}' WHERE id = 37;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -33.01, "y": -1037.84, "z": 37.11, "sx": 1.6, "sy": 1, "heading": 340, "minZ": 36.11, "maxZ": 38.51}' WHERE id = 49;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 2472.9, "y": 4099.23, "z": 40.77, "sx": 1.6, "sy": 0.8, "heading": 340, "minZ": 39.77, "maxZ": 42.17}' WHERE id = 18;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -1128.4, "y": 754.67, "z": 165.08, "sx": 0.8, "sy": 1.6, "heading": 25, "minZ": 163.88, "maxZ": 166.48}' WHERE id = 65;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 282.37, "y": -1077.98, "z": 50.45, "sx": 1.0, "sy": 1.6, "heading": 0, "minZ": 49.45, "maxZ": 51.85}' WHERE id = 52;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 2395.89, "y": 3316.15, "z": 42.94, "sx": 2.4, "sy": 1.0, "heading": 42, "minZ": 41.94, "maxZ": 44.34}' WHERE id = 11;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 100.45, "y": 3681.05, "z": 35.0, "sx": 1.0, "sy": 2.2, "heading": 0, "minZ": 34.0, "maxZ": 36.4}' WHERE id = 4;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 274.06, "y": -1111.88, "z": 39.22, "sx": 1.0, "sy": 1.6, "heading": 0, "minZ": 38.22, "maxZ": 40.62}' WHERE id = 50;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 2199.37, "y": 3318.67, "z": 41.82, "sx": 1.4, "sy": 0.4, "heading": 27, "minZ": 40.82, "maxZ": 43.22}' WHERE id = 14;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -1151.66, "y": 540.39, "z": 103.76, "sx": 1.0, "sy": 1.6, "heading": 10, "minZ": 102.76, "maxZ": 105.16}' WHERE id = 61;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 1667.2, "y": 4652.63, "z": 43.72, "sx": 1.0, "sy": 1.6, "heading": 0, "minZ": 42.52, "maxZ": 45.12}' WHERE id = 29;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 861.33, "y": 2877.69, "z": 52.83, "sx": 1.2, "sy": 2.4, "heading": 5, "minZ": 51.83, "maxZ": 54.23}' WHERE id = 8;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 319.6, "y": -1270.64, "z": 37.9, "sx": 1.6, "sy": 1, "heading": 0, "minZ": 36.9, "maxZ": 39.3}' WHERE id = 48;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -1073.21, "y": -1139.11, "z": 6.78, "sx": 1.6, "sy": 1, "heading": 30, "minZ": 5.78, "maxZ": 8.18}' WHERE id = 57;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 295.67, "y": 113.42, "z": 133.99, "sx": 0.8, "sy": 1.8, "heading": 340, "minZ": 132.89, "maxZ": 135.49}' WHERE id = 41;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 2728.83, "y": 4283.53, "z": 44.2, "sx": 2.4, "sy": 1.2, "heading": 0, "minZ": 43.2, "maxZ": 45.6}' WHERE id = 13;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -31.67, "y": 2885.22, "z": 59.19, "sx": 1.6, "sy": 1.0, "heading": 339, "minZ": 58.19, "maxZ": 60.59}' WHERE id = 24;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -1328.45, "y": 595.06, "z": 135.76, "sx": 1.6, "sy": 1, "heading": 325, "minZ": 134.76, "maxZ": 137.16}' WHERE id = 62;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 31.75, "y": -927.58, "z": 76.26, "sx": 1.8, "sy": 1, "heading": 340, "minZ": 75.21, "maxZ": 77.81}' WHERE id = 33;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -463.14, "y": 6201.8, "z": 33.64, "sx": 1.6, "sy": 1.0, "heading": 0, "minZ": 32.64, "maxZ": 35.04}' WHERE id = 25;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 115.26, "y": -865.74, "z": 106.32, "sx": 1.0, "sy": 1.8, "heading": 340, "minZ": 105.12, "maxZ": 107.72}' WHERE id = 43;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -1113.39, "y": -1202.31, "z": 6.82, "sx": 1.6, "sy": 0.8, "heading": 30, "minZ": 5.82, "maxZ": 8.22}' WHERE id = 56;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -919.1, "y": 690.89, "z": 155.52, "sx": 0.8, "sy": 1.6, "heading": 0, "minZ": 154.32, "maxZ": 156.92}' WHERE id = 63;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 71.06, "y": 3755.77, "z": 34.67, "sx": 2.4, "sy": 1.2, "heading": 10, "minZ": 33.47, "maxZ": 36.07}' WHERE id = 7;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -411.28, "y": 6157.63, "z": 32.37, "sx": 1.0, "sy": 1.6, "heading": 315, "minZ": 31.37, "maxZ": 33.77}' WHERE id = 20;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 2.51, "y": -230.24, "z": 55.85, "sx": 1.6, "sy": 1, "heading": 340, "minZ": 54.85, "maxZ": 57.25}' WHERE id = 58;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 241.18, "y": -327.2, "z": 56.67, "sx": 1.0, "sy": 1.6, "heading": 340, "minZ": 55.67, "maxZ": 58.07}' WHERE id = 59;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 371.28, "y": -886.72, "z": 36.02, "sx": 1.0, "sy": 1.6, "heading": 0, "minZ": 35.02, "maxZ": 37.42}' WHERE id = 60;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 893.39, "y": 2856.89, "z": 50.43, "sx": 1.2, "sy": 2.4, "heading": 50, "minZ": 49.43, "maxZ": 51.83}' WHERE id = 9;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 339.5, "y": -822.28, "z": 40.02, "sx": 1.6, "sy": 1, "heading": 0, "minZ": 39.02, "maxZ": 41.42}' WHERE id = 53;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 100.39, "y": 3649.08, "z": 34.71, "sx": 2.4, "sy": 1.2, "heading": 0, "minZ": 33.71, "maxZ": 36.11}' WHERE id = 5;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 31.7, "y": -927.59, "z": 88.79, "sx": 1.8, "sy": 1, "heading": 340, "minZ": 87.79, "maxZ": 90.19}' WHERE id = 34;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -1015.31, "y": -752.64, "z": 36.32, "sx": 1.8, "sy": 1, "heading": 0, "minZ": 35.17, "maxZ": 37.77}' WHERE id = 40;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -1045.29, "y": -995.58, "z": 6.24, "sx": 0.8, "sy": 1.6, "heading": 30, "minZ": 5.24, "maxZ": 7.64}' WHERE id = 54;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -1075.88, "y": -1058.61, "z": 6.57, "sx": 1, "sy": 1.6, "heading": 30, "minZ": 5.57, "maxZ": 7.97}' WHERE id = 55;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 433.6, "y": 2994.4, "z": 37.32, "sx": 1.0, "sy": 2.2, "heading": 20, "minZ": 36.32, "maxZ": 38.72}' WHERE id = 3;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -128.01, "y": 6558.4, "z": 30.75, "sx": 1.6, "sy": 1, "heading": 315, "minZ": 29.75, "maxZ": 32.15}' WHERE id = 26;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -724.25, "y": -863.65, "z": 29.92, "sx": 1.6, "sy": 1, "heading": 0, "minZ": 28.92, "maxZ": 31.32}' WHERE id = 47;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 912.94, "y": 3578.15, "z": 33.88, "sx": 1.0, "sy": 1.6, "heading": 0, "minZ": 32.68, "maxZ": 35.28}' WHERE id = 19;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": -223.15, "y": -827.46, "z": 84.65, "sx": 1.0, "sy": 1.8, "heading": 340, "minZ": 83.5, "maxZ": 86.1}' WHERE id = 45;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 2163.5, "y": 3377.18, "z": 40.24, "sx": 1.0, "sy": 2.0, "heading": 55, "minZ": 39.24, "maxZ": 41.64}' WHERE id = 14;
        ]],
        [[
            UPDATE player_house SET exit_zone = '{"x": 2409.81, "y": 4019.19, "z": 36.98, "sx": 1.4, "sy": 1, "heading": 341, "minZ": 35.98, "maxZ": 38.38}' WHERE id = 18;
        ]],
        [[
               UPDATE player_house SET exit_zone = '{"x": -859.89, "y": 691.72, "z": 152.86, "sx": 0.8, "sy": 1.4, "heading": 5, "minZ": 151.86, "maxZ": 154.26}' WHERE id = 66;
        ]],
        [[
            UPDATE player_house SET identifier = 'soz_appartements_05' WHERE id = 36;
        ]],
        [[
            UPDATE player_house SET identifier = 'soz_appartements_03'WHERE id = 34;
        ]],
    },
});
