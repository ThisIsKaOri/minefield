import './Grid.css';

import Box, { BoxType } from './Box';
import { useState } from 'react';


export type GridType = BoxType[][];

export type GridProps = {

    settings:{
        width: number;
        height: number;
        bombDensity: number;
    };
};

const generateGrid = (width: number, height: number, bombDensity:number) => {

    const newBox = (x:number, y:number, bombDensity:number): BoxType => {

        return {
            isBomb: Math.random() < bombDensity,
            isCovered: true,
            isFlagged: false,
            value: 0,
            row: y,
            col: x
        };
    };

    const grid = Array.from(Array(height), (_, y) => 
        Array.from(Array(width)).map((_, x) => 
            newBox(x, y, bombDensity)
        )
    );
    return grid
};

const count = (grid: GridType, target: keyof BoxType) => 
    grid.reduce((item,row) => 
        item += row.reduce((rowItem, box) =>  
            rowItem += box[target] ? 1 : 0 
        , 0)
    , 0);


const Grid = ({settings: {width, height, bombDensity}}: GridProps ) => {

    const [grid, setGrid] = useState(generateGrid(width, height, bombDensity));
    const [bombs, setBombs] = useState(count(grid, 'isBomb'));
    const [flags, setFlags] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const reset = () => {
        const newGrid = generateGrid(width, height, bombDensity)
        setGrid(newGrid);
        setBombs(count(newGrid, 'isBomb'));
        setFlags(0);
        setGameOver(false);
    }

    const onFlagHandler = (grid: GridType) => {
        
        setFlags(count(grid, 'isFlagged'));
    } 
    
    const allBombsFlagged = grid.every((row) =>
        row.every((box) => box.isBomb ? box.isFlagged : true)
    );
    
    if(allBombsFlagged) {
        console.log(`hai vinto`);
    }

    return (
        <>
        <div key='score' className="score">
            {!allBombsFlagged && <h1>{gameOver ? `GAME OVER` : `BOMBS: ${bombs - flags}`}</h1>}
            {allBombsFlagged && <h1>You Win!</h1>}
        </div>
        <p>try to find all the bombs</p>
        <div key='grid' className="grid">
            {grid.map((row, y) => {
                
                return (
                    <div key={`row ${y}`} className="row">
                        {row.map((box, x) => {
                        return <Box key={`Box ${y}.${x}`} grid={grid} box={box}
                            setGrid={setGrid}
                            gameOver={gameOver}
                            setGameOver={setGameOver}
                            onFlag={onFlagHandler}/>
                        })}
                    </div>
                );
            })}
        </div>
        <button key='reset' className='reset' onClick={reset}>
            {!gameOver ? `RESET`: `RETRY`}
        </button>
        </>
    );
};

export default Grid;