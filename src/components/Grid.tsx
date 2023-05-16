import './Grid.css';

import Box, { BoxType } from './Box';
import { useState } from 'react';

export type GridType = {

    grid: BoxType[][];
};

export type GridProps = {

    settings:{
        width: number;
        height: number;
        bombDensity: number;
    };
};


const Grid = ({settings: {width, height, bombDensity}}: GridProps ) => {

    const generateGrid = (width: number, height: number, bombDensity:number) => {

        const newBox = (x:number, y:number, bombDensity:number): BoxType => {

            const randomBombs = (bombDensity: number) => {
                return Math.random() < bombDensity;
            };
    
            const newBox = {
                isBomb: randomBombs(bombDensity),
                isCovered: true,
                value: 0,
                row: y,
                col: x
            };
    
            return newBox;
        };

        return Array.from(Array(height), (_, y) => {
            return Array.from(Array(width)).map((_, x) => {
                return newBox(x, y, bombDensity)
            });
        });
    };
    
    const [grid, setGrid] = useState(generateGrid(width, height, bombDensity));
    
    return (
        <div className="grid">
            {grid.map((row) => {
                return (
                    <div className="row">
                        {row.map((box) => <Box grid={grid} box={box}/>)}
                    </div>
                );
            })}
        </div>
    );
};

export default Grid;