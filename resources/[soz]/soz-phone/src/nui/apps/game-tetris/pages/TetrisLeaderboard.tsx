import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from '../../../store';
import GameTetrisIcon from '../icon';

export const TetrisLeaderboard: React.FC = () => {
    const tetrisLeaderboard = useSelector((state: RootState) => state.appTetrisLeaderboard);

    const navigate = useNavigate();

    const onClickBack = () => {
        navigate('/game-tetris/');
    };

    return (
        <div className="tetris_appcontainer">
            <div>
                <div>
                    <div className="tetris_score">
                        <div className="tetris_lefthalf"></div>
                        <div className="tetris_centerhalf">
                            <GameTetrisIcon />
                            Classement Top 15
                        </div>
                        <div className="tetris_righthalf"></div>
                    </div>
                    <table className="tetris_leaderboard">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Score</th>
                                <th>Parties</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tetrisLeaderboard.map((player, i) => (
                                <tr key={i}>
                                    <td>{player.player_name}</td>
                                    <td>{player.score}</td>
                                    <td>{player.game_played}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="tetris_backbutton" onClick={onClickBack}>
                        Retour
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TetrisLeaderboard;
