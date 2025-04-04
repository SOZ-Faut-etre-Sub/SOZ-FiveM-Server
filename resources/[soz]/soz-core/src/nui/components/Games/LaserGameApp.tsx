import { MenuItemText } from '@public/nui/components/Styleguide/Menu';
import { useNuiEvent } from '@public/nui/hook/nui';
import { RGBColor } from '@public/shared/color';
import {
    getDurationStr,
    LaserGameColorEnum,
    LaserGamePlayerData,
    LaserGameTeam,
    LaserGameTeamEnum,
    TeamColorChoices,
} from '@public/shared/games/laser';
import cn from 'classnames';
import { FunctionComponent, useEffect, useState } from 'react';

export const LaserGameApp: FunctionComponent = () => {
    const [scores, setScores] = useState<Record<any, number> | null>(null);
    const [scoresAround, setScoresAround] = useState<Record<any, number> | null>(null);
    const [players, setPlayers] = useState<Record<string, LaserGamePlayerData> | null>(null);
    const [teams, setTeams] = useState<Record<LaserGameTeamEnum, LaserGameColorEnum> | null>(null);
    const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);

    const sortScores = (initialScores: Record<any, number>) => {
        const scoresSorted: Record<any, number> = {};

        for (const [name, score] of Object.entries(initialScores).sort(([nameA, scoreA], [nameB, scoreB]) => {
            if (scoreA < scoreB) {
                return 1;
            }

            if (scoreA > scoreB) {
                return -1;
            }

            return nameA.localeCompare(nameB);
        })) {
            scoresSorted[name] = score;
        }

        return scoresSorted;
    };

    const produceScoreAround = (initialScores: Record<any, number>) => {
        if (currentPlayer) {
            const scoresKey = Object.keys(initialScores);
            const index = scoresKey.indexOf(currentPlayer);
            if (index !== -1) {
                const scoreAroundData: Record<any, number> = {};
                if (scoresKey[index - 1]) {
                    scoreAroundData[scoresKey[index - 1]] = initialScores[scoresKey[index - 1]];
                }
                if (scoresKey[index]) {
                    scoreAroundData[scoresKey[index]] = initialScores[scoresKey[index]];
                }
                if (scoresKey[index + 1]) {
                    scoreAroundData[scoresKey[index + 1]] = initialScores[scoresKey[index + 1]];
                }
                setScoresAround(scoreAroundData);
            } else {
                setScoresAround(null);
            }
        } else {
            setScoresAround(null);
        }
    };

    useNuiEvent('laser_game', 'SetGameData', data => {
        let scoresSorted = null;

        if (data?.scores) {
            scoresSorted = sortScores(data.scores);
            produceScoreAround(scoresSorted);
        } else {
            setScoresAround(null);
        }
        setScores(scoresSorted);
        setPlayers(data?.players || null);
        setTeams(data?.teams || null);
    });

    useNuiEvent('laser_game', 'SetCurrentPlayer', data => {
        setCurrentPlayer(data);
    });

    useNuiEvent('laser_game', 'SetScores', data => {
        let scoresSorted = null;

        if (data) {
            scoresSorted = sortScores(data);
            produceScoreAround(scoresSorted);
        } else {
            setScoresAround(null);
        }
        setScores(scoresSorted);
    });

    if (!scores || !teams || !currentPlayer || !players) {
        return;
    }

    return (
        <>
            <div className="pt-24">
                <CountDown />
                <Death />
            </div>
            <div className="font-prompt font-medium text-white absolute left-[1%] top-20">
                {Object.entries(scores).map(([id, score], index: number) => {
                    let name: string;
                    let color: RGBColor;
                    if (LaserGameTeam[id]) {
                        name = LaserGameTeam[id];
                        color = TeamColorChoices[teams[id]].color;
                    } else {
                        name = players[id].name;
                        color = TeamColorChoices[players[id].color].color;
                    }
                    if (index < 5) {
                        return <Score name={name} score={score} color={color} index={index + 1} />;
                    }
                })}
                {scoresAround && scores && Object.keys(scores).indexOf(currentPlayer) >= 5 && (
                    <MenuItemText></MenuItemText>
                )}
                {scoresAround &&
                    scores &&
                    Object.keys(scores).indexOf(currentPlayer) >= 5 &&
                    Object.entries(scoresAround).map(([id, score]) => {
                        let name: string;
                        let color: RGBColor;
                        if (LaserGameTeam[id]) {
                            name = LaserGameTeam[id];
                            color = TeamColorChoices[teams[id]].color;
                        } else {
                            name = players[id].name;
                            color = TeamColorChoices[players[id].color].color;
                        }

                        const currentIndex = Object.keys(scores).indexOf(id);
                        if (currentIndex >= 5) {
                            return <Score name={name} score={score} color={color} index={currentIndex + 1} />;
                        }
                    })}
                <Timer />
            </div>
        </>
    );
};

const Timer: FunctionComponent = () => {
    const [currentDuration, setCurrentDuration] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [gameDuration, setGameDuration] = useState<number>(0);

    useEffect(() => {
        const timer = setInterval(() => {
            const duration = !startTime ? 0 : startTime + gameDuration - Date.now();
            setCurrentDuration(duration);
        }, 20);

        return () => {
            clearInterval(timer);
        };
    }, [currentDuration, startTime]);

    useNuiEvent('laser_game', 'SetStart', data => {
        setStartTime(data?.start);
        setGameDuration(data?.duration);
    });

    if (!startTime) {
        return;
    }

    return (
        <div className="text-2xl font-lato font-bold bg-opacity-60 bg-race-notcurrent italic rounded-md w-60 m-2 p-2 text-right">
            {getDurationStr(currentDuration)}
        </div>
    );
};

type ScoreProps = {
    color: RGBColor;
    name: string;
    score: number;
    index: number;
};

const Score: FunctionComponent<ScoreProps> = ({ name, score, color, index }) => {
    return (
        <div className={cn('flex text-xl justify-center bg-opacity-60 italic rounded-md w-60 m-2')} key={name}>
            <span className="flex-auto w-32" style={{ color: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}>
                {index}. {name}
            </span>
            <span
                className={cn('flex-auto w-8 font-lato font-bold text-right text-xs')}
                style={{ lineHeight: '1.75rem' }}
            >
                {score}
            </span>
        </div>
    );
};

const CountDown: FunctionComponent = () => {
    const [countDown, setCountDown] = useState<string | null>(null);

    useNuiEvent('laser_game', 'SetCountDown', data => {
        setCountDown(data);
    });

    if (!countDown) {
        return;
    }

    return (
        <div className="font-prompt font-medium text-white italic text-6xl text-center animate-display-persist opacity-100">
            {countDown}
        </div>
    );
};

const Death: FunctionComponent = () => {
    const [feed, setFeed] = useState<JSX.Element[]>([]);

    useNuiEvent('laser_game', 'AddKilled', data => {
        setFeed(old => [...old, <p className="text-red-500">{`Touché(e) par ${data}`}</p>]);
        setTimeout(() => {
            setFeed(old => old.slice(1));
        }, 3000);
    });

    useNuiEvent('laser_game', 'AddKill', data => {
        setFeed(old => [...old, <p className="text-green-500">{`${data} a été touché(e)`}</p>]);
        setTimeout(() => {
            setFeed(old => old.slice(1));
        }, 3000);
    });

    if (!feed.length) {
        return;
    }

    return (
        <div className="font-lato font-bold bg-opacity-60 italic text-2xl text-center animate-display-persist tp-10">
            {feed.map(info => info)}
        </div>
    );
};
