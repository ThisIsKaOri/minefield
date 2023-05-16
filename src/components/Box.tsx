import { SyntheticEvent, useState } from 'react';
import './Box.css';
import { GridType } from './Grid';

export type BoxType = {
    isBomb: boolean;
    isCovered: boolean;
    value: number;
    row: number;
    col: number;
};

type BoxProps = {

    box: BoxType
    grid: any;
}

const Box = ({box:{isBomb, isCovered, value, row, col}, grid}: BoxProps) => {

    let debug = false;
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;

    const proximityValue = (row: number, col: number, grid: any) => {

        const proximityIndexes = (row: number, col:number) => {

            const tL = [(row -1), (col - 1)];
            const t = [(row -1), col];
            const tR = [(row -1), (col + 1)];
            const r = [(row), (col + 1)];
            const bR = [(row + 1), (col + 1)];
            const b = [(row + 1), (col)];
            const bL = [(row + 1), (col - 1)];
            const l = [(row), (col - 1)];
    
            const proximityIndexes = [tL, t, tR, r, bR, b, bL, l]
            .filter(([row, col]) => {
                return (row >= 0 && col >= 0) && (row < gridHeight && col < gridWidth);
            });
            return proximityIndexes;
        };

        const nearestBoxes = proximityIndexes(row, col);

        return nearestBoxes.reduce((value, [row, col]) => {
            return grid[row][col].isBomb ? value + 1 : value
        }, 0);
    };
    
    value = proximityValue(row, col, grid);

    return(
        <>
        {debug && <button className={`box`}>{`${row}-${col}`}</button>}
        {!debug && 
        <button className={`box`}>
            {!isCovered ? (isBomb? `💣`: value) : ``}
        </button>}
        </>
    );
}

export default Box;