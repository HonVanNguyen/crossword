import { CluesInput } from "@jaredreisinger/react-crossword";
import { CluesData, Direction, GridData } from "@jaredreisinger/react-crossword/dist/types";
import { UsedCellData } from "../data/type";
type RowOrCol = 'row' | 'col';
interface RowColMax {
    row: number;
    col: number;
  }
  
const directionInfo: Record<
  Direction,
  { primary: RowOrCol; orthogonal: RowOrCol }
> = {
  across: {
    primary: 'col',
    orthogonal: 'row',
  },
  down: {
    primary: 'row',
    orthogonal: 'col',
  },
};

export function calculateExtents(data: CluesInput, direction: Direction) {
    const dir = directionInfo[direction];
    let primaryMax = 0;
    let orthogonalMax = 0;
  
    Object.entries(data[direction]).forEach(([, info]) => {
      const primary = info[dir.primary] + info.answer.length - 1;
      if (primary > primaryMax) {
        primaryMax = primary;
      }
  
      const orthogonal = info[dir.orthogonal];
      if (orthogonal > orthogonalMax) {
        orthogonalMax = orthogonal;
      }
    });
  
    const rowColMax: RowColMax = {
      row: 0,
      col: 0,
    };
  
    rowColMax[dir.primary] = primaryMax;
    rowColMax[dir.orthogonal] = orthogonalMax;
  
    return rowColMax;
  }

  export function createEmptyGrid(rows: number, cols: number) {
    const gridData: GridData = Array(rows);
    // Rather than [x][y] in column-major order, the cells are indexed as
    // [row][col] in row-major order.
    for (let r = 0; r < rows; r++) {
      gridData[r] = Array(cols);
      for (let c = 0; c < cols; c++) {
        gridData[r][c] = {
          // ...emptyCellData,
          row: r,
          col: c,
          used: false,
        };
      }
    }
  
    return gridData;
  }
  interface HasNumber {
    number: string;
  }
  
  export function byNumber(a: HasNumber, b: HasNumber) {
    const aNum = Number.parseInt(a.number, 10);
    const bNum = Number.parseInt(b.number, 10);
  
    return aNum - bNum;
  }

  export function fillClues(
    gridData: GridData,
    clues: CluesData,
    data: CluesInput,
    direction: Direction
  ) {
    const dir = directionInfo[direction];
  
    Object.entries(data[direction]).forEach(([number, info]) => {
      const { row: rowStart, col: colStart, clue, answer } = info;
      for (let i = 0; i < answer.length; i++) {
        const row = rowStart + (dir.primary === 'row' ? i : 0);
        const col = colStart + (dir.primary === 'col' ? i : 0);
        const cellData = gridData[row][col] as UsedCellData;
  
        // TODO?: check to ensure the answer is the same if it's already set?
        cellData.used = true;
        cellData.answer = answer[i];
        cellData[direction] = number;
  
        if (i === 0) {
          // TODO?: check to ensure the number is the same if it's already set?
          cellData.number = number;
        }
      }
  
      clues[direction].push({
        number,
        clue,
        answer,
        col: colStart,
        row: rowStart,
      });
    });
  
    clues[direction].sort(byNumber);
  }

export function createGridData(data: CluesInput, allowNonSquare?: boolean) {
    const acrossMax = calculateExtents(data, 'across');
    const downMax = calculateExtents(data, 'down');
  
    let rows = Math.max(acrossMax.row, downMax.row) + 1;
    let cols = Math.max(acrossMax.col, downMax.col) + 1;
  
    if (!allowNonSquare) {
      const size = Math.max(rows, cols);
      rows = size;
      cols = size;
    }
  
    const gridData = createEmptyGrid(rows, cols);
  
    // Now fill with answers... and also collect the clues
    const clues: CluesData = {
      across: [],
      down: [],
    };
  
    fillClues(gridData, clues, data, 'across');
    fillClues(gridData, clues, data, 'down');
  
    return { rows, cols, gridData, clues };
  }

  export function clearGuesses(storageKey: string) {
    if (!window.localStorage) {
      return;
    }
  
    window.localStorage.removeItem(storageKey);
  }