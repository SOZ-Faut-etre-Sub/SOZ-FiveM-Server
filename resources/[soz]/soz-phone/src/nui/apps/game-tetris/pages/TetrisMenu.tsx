import React, { useEffect, useState } from 'react';

interface ChildProps {
    startGame: Function
  }
 
 export const TetrisMenu: React.FC<ChildProps> = (props: ChildProps) => {
    // create div with logo and two buttons under logo

     return (
            <div className="flex flex-col items-center justify-center absolute top-0 left-0 right-0 bottom-0 bg-black-800 text-white text-center font-bold text-xl">
                <div className="mb-10">Tetris</div>
                <button className="mb-5 rounded-full py-3 px-5 bg-white text-black hover:bg-black hover:text-white" onClick={() => props.startGame()}>
                    Start
                </button>
                <button className="mb-5 rounded-full py-3 px-5 bg-white text-black hover:bg-black hover:text-white">
                    Leaderboard
                </button>
            </div>
     );
 };
 
 /*
 </Transition>
                 <Transition
                 show={isGameOver}
                 enter="transition-opacity duration-75"
                 enterFrom="opacity-0"
                 enterTo="opacity-100"
                 leave="transition-opacity duration-150"
                 leaveFrom="opacity-100"
                 leaveTo="opacity-0"
                 >
                 <div className="flex flex-col items-center justify-center absolute top-0 left-0 right-0 bottom-0 bg-black-800 text-white text-center font-bold text-xl">
                     <div className="mb-10">Game Over</div>
                     <button onClick={resetGame} className="mb-5 rounded-full py-3 px-5 bg-white text-black hover:bg-black hover:text-white">
                     Restart
                     </button>
                 </div>
                 </Transition>
 */
 
 export default TetrisMenu;
 