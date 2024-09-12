import { GridPosition } from "@jaredreisinger/react-crossword";
import { CrosswordSizeContextType } from "@jaredreisinger/react-crossword/dist/context";
import {
  CellData,
  CluesData,
  GridData,
} from "@jaredreisinger/react-crossword/dist/types";
import React from "react";

export type Cell = number | string | null | { cell?: number; style?: unknown };

export type Puzzle = Cell[][];

export interface Clues {
  Across: [number, string][];
  Down: [number, string][];
}

export type Solution = string[][];

export interface DataTableCross {
  origin?: string;
  version?: string;
  kind?: string[];
  copyright?: string;
  author?: string;
  publisher?: string;
  title?: string;
  intro?: string;
  difficulty?: string;
  empty?: string;
  dimensions?: { width: number; height: number };
  puzzle?: Puzzle;
  clues?: Clues;
  solution?: Solution;
  outer?: Puzzle
}

export type UsedCellData = GridPosition & {
  /** Whether the position/cell is used at all. */
  used: boolean;
  // /** The clue related to this cell? what? Shouldn't be needed! */
  // clue: string;
  /** If present, a display "number" label for the cell */
  number?: string;
  /** The correct answer value for *only* this cell (a single letter) */
  answer: string;
  /** The user's guess value for *only* this cell (a single letter) */
  guess?: string;
  /** If present, the clue-number key for the "across" for this cell */
  across?: string;
  /** If present, the clue-number key for the "down" for this cell */
  down?: string;
};

export type DataGues = {
  row: number;
  col: number;
  guess: string;
};

// custom
function nop() {}

export const CrosswordContext = React.createContext<CrosswordContextType>({
  rows: 0,
  cols: 0,
  gridData: [],
  // clues: { across: [], down: [] },

  handleInputKeyDown: nop,
  handleInputChange: nop,
  handleCellClick: nop,
  handleInputClick: nop,
  handleClueSelected: nop,
  registerFocusHandler: nop,

  focused: false,
  selectedPosition: { row: 0, col: 0 },
  selectedDirection: "across",
  selectedNumber: "",

  crosswordCorrect: false,
});

export const CrosswordSizeContext =
  React.createContext<CrosswordSizeContextType>({
    cellSize: 0,
    cellPadding: 0,
    cellInner: 0,
    cellHalf: 0,
    fontSize: 0,
  });
export interface FocusHandler {
  (): void;
}

export interface CrosswordContextType {
  /** The number of rows in the crossword. */
  rows: number;
  /** The number of columns in the crossword. */
  cols: number;
  /** The crossword grid data, including player guesses and "correct" status. */
  gridData: GridData;
  /** The across/down clues, including "correct" status. */
  clues?: CluesData;

  /** A handler for `<input>` element KeyDown events. */
  handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  /** A handler for `<input>` element Change events. */
  handleInputChange: React.ChangeEventHandler<HTMLInputElement>;
  /** A handler for clicks on any cell in the crossword. */
  handleCellClick: (cellData: CellData) => void;
  /** A handler for `<input>` element Click events. */
  handleInputClick: React.MouseEventHandler<HTMLInputElement>;
  /** A handler for clue selection. */
  handleClueSelected: (direction: Direction, number: string) => void;
  /** Provides registration for focus actions */
  registerFocusHandler: (focusHandler: FocusHandler | null) => void;

  // player state
  focused: boolean;
  selectedPosition: GridPosition;
  selectedDirection: Direction;
  selectedNumber: string;

  crosswordCorrect: boolean;
}

export type AnswerTuple = [Direction, string, string];
type RowOrCol = "row" | "col";
const directionInfo: Record<
  Direction,
  { primary: RowOrCol; orthogonal: RowOrCol }
> = {
  across: {
    primary: "col",
    orthogonal: "row",
  },
  down: {
    primary: "row",
    orthogonal: "col",
  },
};

export const bothDirections = Object.keys(directionInfo) as Direction[];
export function isAcross(direction: Direction) {
  return direction === "across";
}
export function otherDirection(direction: Direction) {
  return isAcross(direction) ? "down" : "across";
}
export function loadGuesses(gridData: GuessData, storageKey: string) {
  const { localStorage } = window;
  if (!localStorage) {
    return;
  }

  const saveRaw = localStorage.getItem(storageKey);
  if (!saveRaw) {
    return;
  }

  const saveData = JSON.parse(saveRaw);

  // TODO: check date for expiration?
  deserializeGuesses(gridData, saveData.guesses);
}
export type GuessData = ({ guess?: string } | CellData)[][];
export function deserializeGuesses(
  gridData: GuessData,
  guesses: Record<string, string>
) {
  Object.entries(guesses).forEach(([key, val]) => {
    const [rStr, cStr] = key.split('_');
    const r = parseInt(rStr, 10);
    const c = parseInt(cStr, 10);
    // ignore any out-of-bounds guesses!
    if (r <= gridData.length - 1 && c <= gridData[0].length - 1) {
      (gridData[r][c] as UsedCellData).guess = val;
    }
  });
}
export function saveGuesses(gridData: GuessData, storageKey: string) {
  const { localStorage } = window;
  if (!localStorage) {
    return;
  }

  const guesses = serializeGuesses(gridData);

  const saveData = {
    date: Date.now(),
    guesses,
  };

  localStorage.setItem(storageKey, JSON.stringify(saveData));
}
export function serializeGuesses(gridData: GuessData) {
  const guesses = gridData.reduce<Record<string, string>>(
    (memo, row, r) =>
      row.reduce<Record<string, string>>((memoInner, cellData, c) => {
        const { guess } = cellData as UsedCellData;
        if (guess !== '') {
          memoInner[`${r}_${c}`] = (cellData as UsedCellData).guess ?? '';
        }
        return memoInner;
      }, memo),
    {}
  );

  return guesses;
}
import { InferProps } from 'prop-types';

export type OverrideProps<T, O> = Omit<T, keyof O> & O;

export type EnhancedProps<T, O> = OverrideProps<InferProps<T>, O>;

export type Direction = 'across' | 'down';