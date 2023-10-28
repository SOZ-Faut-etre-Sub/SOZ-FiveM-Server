import { ScenarioState } from './story';

export type Halloween2022 = {
    scenario1: {
        part1?: ScenarioState;
        part2?: ScenarioState;
        part3?: ScenarioState;
        part4?: ScenarioState;
        part5?: ScenarioState;
        part6?: ScenarioState;
        part7?: ScenarioState;
    };
    scenario2: {
        part1?: ScenarioState;
        part2?: ScenarioState;
        part3?: ScenarioState;
        part4?: ScenarioState;
        part5?: ScenarioState;
        part6?: ScenarioState;
    };
    scenario3: {
        part1?: ScenarioState;
        part2?: ScenarioState;
        part3?: ScenarioState;
        part4?: ScenarioState;
        part5?: ScenarioState;
    };
    scenario4: {
        part1?: ScenarioState;
        part2?: ScenarioState;
        part3?: ScenarioState;
        part4?: ScenarioState;
        part5?: ScenarioState;
        part6?: ScenarioState;
        part7?: ScenarioState;
    };
};

export type Halloween2023 = {
    scenario1: {
        part1?: ScenarioState;
        part2?: ScenarioState;
        part3?: ScenarioState;
        part4?: ScenarioState;
        part5?: ScenarioState;
        part6?: ScenarioState;
        part7?: ScenarioState;
    };
    scenario2: {
        part1?: ScenarioState;
        part2?: ScenarioState;
        part3?: ScenarioState;
        part4?: ScenarioState;
        part5?: ScenarioState;
        part6?: ScenarioState;
        part7?: ScenarioState;
    };
};

export const DeguisementMapping: Record<string, string> = {
    halloween_zombie_costume: 'U_M_Y_Zombie_01',
    halloween_alien_costume: 'S_M_M_MovAlien_01',
    halloween_gorilla_costume: 'IG_Orleans',
    halloween_galactic_ranger_costume: 'U_M_Y_RSRanger_01',
    halloween_space_monkey_costume: 'u_m_y_pogo_01',
    halloween_astronaut_costume: 'S_M_M_MovSpace_01',
    halloween_fury_costume: 'IG_Furry',
    halloween_juggernaut_costume: 'u_m_y_juggernaut_01',
};
