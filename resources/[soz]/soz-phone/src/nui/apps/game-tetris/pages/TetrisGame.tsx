import React from 'react';
import Tetris from '../components/Tetris';
import { useNavigate } from 'react-router-dom';

import { store } from '../../../store';


export const TetrisGame: React.FC = () => {
  const navigate = useNavigate();

  const onClickLeaderboard = () => {
      navigate('/game-tetris/leaderboard');
  };


  return (
  <div className='tetris_appcontainer'>
    <Tetris>
      {({
        Gameboard,
        PieceQueue,
        points,
        linesCleared,
        state,
        controller
      }) => (
        <div>
          <div style={{ opacity: state === 'PLAYING' ? 1 : 0.5 }}>
            <div className='tetris_score'>
              <div className='tetris_lefthalf'>
                <p>
                  Score
                  <br />
                  <Digits>{points}</Digits>
                </p>
              </div>
              <div className='tetris_centerhalf'>
                <PieceQueue />
              </div>
              <div className='tetris_righthalf'>
                <button onClick={onClickLeaderboard}>Classement</button>
              </div>
            </div>
            <div className='tetris_middlecolumn'>
              <Gameboard />
            </div>
          </div>
          {state === 'LOST' && (
            <div className='tetris_popup'>
              <div className='tetris_alert'>Perdu !</div>
              <p> Score: {points}</p>
              <div className='tetris_button' onClick={controller.restart}>Recommencer</div>
            </div>
          )}
        </div>
      )}
    </Tetris>
  </div>
  )
};


type DigitsProps = {
  children: number;
  count?: number;
};
const Digits = ({ children, count = 4 }: DigitsProps): JSX.Element => {
  let str = children.toString();

  while (str.length < count) {
    str = `${0}${str}`;
  }

  return (
    <>
      {str.split('').map((digit, index) => (
        <span className='tetris_digit' key={index}>{digit}</span>
      ))}
    </>
  );
};

export default TetrisGame;
