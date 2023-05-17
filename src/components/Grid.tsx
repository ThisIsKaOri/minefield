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

        const randomBombs = (bombDensity: number) => {
            return Math.random() < bombDensity;
        };

        return {
            isBomb: randomBombs(bombDensity),
            isCovered: true,
            isFlagged: false,
            value: 0,
            row: y,
            col: x
        };
    };

    return Array.from(Array(height), (_, y) => {
        return Array.from(Array(width)).map((_, x) => {
            return newBox(x, y, bombDensity)
        });
    });
};

const totalBombs = (grid: GridType) => {
    const rowBombs = grid.map((row) => {
        return row.reduce((bombs, box) => { 
            return box.isBomb ? bombs += 1 : bombs;
        }, 0)
    })
    return rowBombs.reduce((totalBombs, rowBombs) => {
        return totalBombs += rowBombs;
    }, 0)
};

const totalFlags = (grid: GridType) => {
    const rowFlagged = grid.map((row) => {
        return row.reduce((flags, box) => { 
            return box.isFlagged ? flags += 1 : flags;
        }, 0)
    })
    return rowFlagged.reduce((totalFlagged, rowFlagged) => {
        return totalFlagged += rowFlagged;
    }, 0)
};

const Grid = ({settings: {width, height, bombDensity}}: GridProps ) => {

    const [grid, setGrid] = useState(generateGrid(width, height, bombDensity));
    const [bombs, setBombs] = useState(totalBombs(grid));
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);

    if(bombs - totalFlags(grid) === 0) {
        setWin(true);
    }
    console.log(totalFlags(grid));
    
    const reset = () => {
        setGrid(generateGrid(width, height, bombDensity));
        setGameOver(false);
        setBombs(totalBombs(grid));
    }

    return (
        <>
        {!win && <h1>{gameOver ? `Game Over` : `BOMBS: ${bombs}`}</h1>}
        {win && <h1>You Win!</h1>}
        <div className="grid">
            {grid.map((row) => {
                
                return (
                    <div className="row">
                        {row.map((box) => {
                        return <Box grid={grid} box={box}
                            setGrid={setGrid}
                            gameOver={gameOver}
                            setGameOver={setGameOver}/>
                        })}
                    </div>
                );
            })}
        </div>
        <button className='reset' onClick={reset}>
            {!gameOver ? `RESET`: `RETRY`}
        </button>
        </>
    );
};

export default Grid;