import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemNumberInput,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSelectOptionColor,
    MenuItemSubMenuLink,
    MenuItemText,
    MenuSubTitle,
    MenuTitle,
    SubMenu,
} from '@public/nui/components/Styleguide/Menu';
import { fetchNui } from '@public/nui/fetch';
import { useNuiEvent } from '@public/nui/hook/nui';
import { NuiEvent } from '@public/shared/event/nui';
import {
    LaserGameColorEnum,
    LaserGameData,
    LaserGameDefaultDuration,
    LaserGameMaximalDuration,
    LaserGameMinimalDuration,
    LaserGameTeam,
    LaserGameTeamEnum,
    LaserGameType,
    LaserGameTypeEnum,
    TeamColorChoices,
} from '@public/shared/games/laser';
import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent, useState } from 'react';

type MenuLaserGameManageProps = {
    data: LaserGameData;
};

export const MenuLaserGameManage: FunctionComponent<MenuLaserGameManageProps> = ({
    data: { type, players, creator, teams, scoreGoal, gameDuration },
}) => {
    const [playerData, setPlayerData] = useState(players);
    const [teamData, setTeamData] = useState(teams);
    const [scoreMenu, setScoreMenu] = useState(scoreGoal.toString());
    const [durationMenu, setDurationMenu] = useState((gameDuration / 60000).toString());

    useNuiEvent('laser_game_manage', 'SetPlayerData', async ({ players }) => {
        setPlayerData(players);
    });

    const updateColor = (citizenId: string, color: LaserGameColorEnum) => {
        if (color === playerData[citizenId].color) {
            return;
        }
        playerData[citizenId].color = color;
        setPlayerData(playerData);
        fetchNui(NuiEvent.LaserGameSetPlayerColor, { citizenId, color });
    };

    const updateTeam = (team: LaserGameTeamEnum, color: LaserGameColorEnum) => {
        teamData[team] = color;
        setTeamData(teamData);
        fetchNui(NuiEvent.LaserGameSetTeamColor, { team, color });
    };

    const onScoreGoalChange = async (_, value: string) => {
        setScoreMenu(value);
    };

    const onScoreGoalBlur = async () => {
        let scoreAsInt = parseInt(scoreMenu);
        if (isNaN(scoreAsInt)) {
            setScoreMenu('0');
            scoreAsInt = 0;
        }

        fetchNui(NuiEvent.LaserGameSetScoreGoal, { scoreGoal: scoreAsInt });
    };

    const onDurationChange = async (_, value: string) => {
        setDurationMenu(value);
    };

    const onDurationBlur = async () => {
        let durationAsInt = parseInt(durationMenu);
        if (isNaN(durationAsInt)) {
            durationAsInt = LaserGameDefaultDuration / 60000;
        } else {
            durationAsInt = Math.min(
                Math.max(durationAsInt, LaserGameMinimalDuration / 60000),
                LaserGameMaximalDuration / 60000
            );
        }
        setDurationMenu(`${durationAsInt}`);

        fetchNui(NuiEvent.LaserGameSetGameDuration, { gameDuration: durationAsInt * 60000 });
    };

    return (
        <Menu type={MenuType.LaserGameManage}>
            <MainMenu>
                <MenuTitle title={`Laser Game - ${LaserGameType[type].name}`} />
                <MenuContent helpPanel={LaserGameHelpPanel}>
                    <MenuItemSubMenuLink key={`laser_game_manage_player`} id={`laser_game_manage_player`}>
                        Gérer les joueurs
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink key={`laser_game_manage_team`} id={`laser_game_manage_team`}>
                        Gérer la tenue des joueurs
                    </MenuItemSubMenuLink>
                    <MenuItemNumberInput
                        name="score"
                        onChange={onScoreGoalChange}
                        onBlur={onScoreGoalBlur}
                        value={scoreMenu}
                    >
                        Score de victoire:
                    </MenuItemNumberInput>
                    <MenuItemNumberInput
                        name="duration"
                        onChange={onDurationChange}
                        onBlur={onDurationBlur}
                        value={durationMenu}
                    >
                        Temps maximal de la partie (minutes):
                    </MenuItemNumberInput>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.LaserGameStartGame);
                        }}
                    >
                        Démarrer la partie
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.LaserGameCancelGame);
                        }}
                    >
                        Annuler la partie
                    </MenuItemButton>
                </MenuContent>
            </MainMenu>
            <SubMenu id={'laser_game_manage_player'}>
                <MenuTitle title="Gérer les joueurs" />
                <MenuContent>
                    {type === LaserGameTypeEnum.FFA && Object.keys(playerData).length <= 1 && (
                        <MenuItemText>Aucun joueur enregistré</MenuItemText>
                    )}
                    {Object.values(playerData).map(
                        player =>
                            (!(type === LaserGameTypeEnum.FFA && player.citizenId === creator) ||
                                type !== LaserGameTypeEnum.FFA) && (
                                <MenuItemSelect
                                    title={`${player.name} - ${LaserGameTeam[player.team] || 'Aucune Team'}`}
                                    onConfirm={async (_, value) => {
                                        await fetchNui(NuiEvent.LaserGameActionPlayer, {
                                            action: value,
                                            targetCitizenId: player.citizenId,
                                        });
                                    }}
                                >
                                    {player.citizenId !== creator && (
                                        <MenuItemSelectOption value="kick">Kick Player</MenuItemSelectOption>
                                    )}
                                    {type != LaserGameTypeEnum.FFA && (
                                        <>
                                            <MenuItemSelectOption value="team1">
                                                Ajouter à l'équipe A
                                            </MenuItemSelectOption>
                                            <MenuItemSelectOption value="team2">
                                                Ajouter à l'équipe B
                                            </MenuItemSelectOption>
                                            <MenuItemSelectOption value="noteam">
                                                Retirer de l'équipe
                                            </MenuItemSelectOption>
                                        </>
                                    )}
                                </MenuItemSelect>
                            )
                    )}
                </MenuContent>
            </SubMenu>
            <SubMenu id={'laser_game_manage_team'}>
                <MenuTitle title="Gérer la tenue des joueurs" />
                <MenuContent>
                    {type === LaserGameTypeEnum.FFA &&
                        Object.values(playerData).map(player => (
                            <MenuItemSelect
                                title={player.name}
                                distance={3}
                                value={player.color}
                                onChange={async (_, value) => {
                                    updateColor(player.citizenId, value);
                                }}
                            >
                                {Object.entries(TeamColorChoices).map(([color, option]) => {
                                    return (
                                        <MenuItemSelectOptionColor
                                            color={option.color}
                                            label={option.label}
                                            value={color}
                                            key={color}
                                        />
                                    );
                                })}
                            </MenuItemSelect>
                        ))}
                    {type !== LaserGameTypeEnum.FFA &&
                        Object.values(LaserGameTeamEnum).map(team => (
                            <MenuItemSelect
                                title={LaserGameTeam[team]}
                                distance={3}
                                value={teamData[team]}
                                onChange={async (_, value) => {
                                    updateTeam(team as LaserGameTeamEnum, value);
                                }}
                            >
                                {Object.entries(TeamColorChoices).map(([color, option]) => {
                                    return (
                                        <MenuItemSelectOptionColor
                                            color={option.color}
                                            label={option.label}
                                            value={color}
                                            key={color}
                                        />
                                    );
                                })}
                            </MenuItemSelect>
                        ))}
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};

const LaserGameHelpPanel = (
    <>
        <MenuSubTitle>Info</MenuSubTitle>
        <MenuItemText> Score : Nombre de kill a atteindre pour gagner la partie</MenuItemText>
        <MenuItemText>
            La partie s'arrête quand le score est atteint ou que la limite de temps est atteinte.
        </MenuItemText>
    </>
);
