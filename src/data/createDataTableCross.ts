
import { Clues, DataTableCross, Puzzle, Solution } from "./type";
export const createDataTableCross = (
    puzzle: Puzzle,
    clues: Clues,
    solution: Solution
  ): DataTableCross => {
    return {
      version: "http://ipuz.org/v1",
      kind: ["http://ipuz.org/crossword#1"],
      empty: "0",
      dimensions: { width: 13, height: 17 },
      puzzle, 
      clues, 
      solution, 
    };
  };