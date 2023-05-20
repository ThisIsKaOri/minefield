import './Box.css';
import { GridType } from './Grid';


export type BoxType = {
    isBomb: boolean;
    isCovered: boolean;
    isFlagged: boolean;
    value: number;
    row: number;
    col: number;
};

type BoxProps = {
    box: BoxType
    grid: GridType;
    setGrid: React.Dispatch<React.SetStateAction<BoxType[][]>>;
    gameOver: boolean;
    setGameOver: React.Dispatch<React.SetStateAction<boolean>>
    onFlag: (grid: GridType) => void;
};

const proximityIndexes = (row: number, col:number, grid:GridType) => {

    return [
        [(row -1), (col - 1)],
        [(row -1), col],
        [(row -1), (col + 1)],
        [(row), (col + 1)],
        [(row + 1), (col + 1)],
        [(row + 1), (col)],
        [(row + 1), (col - 1)],
        [(row), (col - 1)]
    ].filter(([row, col]) => {
        return (row >= 0 && col >= 0) && (row < grid.length && col < grid[0].length);
    });
};

const proximityValue = (row: number, col: number, grid:GridType) => {
    
    return proximityIndexes(row, col, grid).reduce((value, [row, col]) => 
        grid[row][col].isBomb ? value + 1 : value
    , 0);
};

const zeroValuesAround = (row: number, col: number, grid:GridType) => {

    return proximityIndexes(row, col, grid).filter(([row, col]) => 
        proximityValue(row, col, grid) === 0
    );
};

const uncoverZeroes = (row: number, col: number, grid:GridType) => {

    const zeroBoxes = zeroValuesAround(row, col, grid)
    zeroBoxes.map(([row, col]) => {
                
        if(!grid[row][col].isBomb){
            grid[row][col].isCovered = false;
        };
    });
    //zeroBoxes.map(([row, col]) => uncoverZeroes(row, col, grid));
};

const setFlag = (row: number, col: number, grid:GridType) => {

    if(grid[row][col].isBomb){

        const uncoveredAround = proximityIndexes(row, col, grid)
        .filter(([subR, subC]) => grid[subR][subC].isCovered === false || 
        (grid[subR][subC].isCovered && grid[subR][subC].isBomb));

        if(uncoveredAround.length === 3){
        
            if( (row === 0 && col === 0) ||
                (row === 0 && col === (grid[0].length -1)) ||
                (row === (grid.length-1) && col === (grid[0].length -1)) ||
                (row === (grid.length-1) && col === 0)){

                return true;
            };
        };
    
        if(uncoveredAround.length === 5){
            
            if( row === 0 || 
                row === (grid.length-1) || 
                col === 0 || 
                col === (grid[0].length -1)){

                return true;
            };
        };
    
        if (uncoveredAround.length === 8) {

            return true;
        };
    };

    return false;
};


const Box = ({box, grid, setGrid, gameOver, setGameOver, onFlag}: BoxProps) => {
    
    const valueColor = [
        '', 
        'green', 
        'orange', 
        'red', 
        'red', 
        'red', 
        'red', 
        'red'
    ];
    const boxData = {
        ...box,
        value: proximityValue(box.row, box.col, grid),
        isFlagged: !gameOver ? setFlag(box.row, box.col, grid) : false
    };
    const gridData = [...grid];
    gridData[boxData.row][boxData.col] = {...boxData};

    onFlag(gridData)

    const onClickHandler = () => {
        
        if(!gameOver) {

            if(boxData.isBomb) {

                setGameOver(true);
                boxData.isCovered = false;
                gridData.map((row) => 
                    row.map((box: BoxType) => 
                        box.isCovered = false
                    )
                );
            };

            if(boxData.isCovered && !boxData.isBomb) {

                boxData.isCovered = false;
                gridData[boxData.row][boxData.col] = {...boxData};

                uncoverZeroes(boxData.row, boxData.col, gridData);
            };
        }

        setGrid([...gridData]);   
    };


    return(

        <button key={`${box.row}${box.col}`}
            className={`box ${valueColor[boxData.value]} ${boxData.value} 
            ${gameOver && boxData.isBomb ? 'gameOver' : ''}`}
            onClick={onClickHandler}>
            {boxData.isFlagged ? <span className="flag">🚩</span> : ``}
            {!boxData.isCovered ? (
                boxData.isBomb? `💣`: (
                    boxData.value !== 0 ? boxData.value : ''
                    )
                ) : ``}
            {boxData.isCovered && <span className='covered'></span>}
        </button>
    );
};

export default Box;