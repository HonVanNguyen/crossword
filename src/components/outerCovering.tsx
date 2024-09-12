import React, {
    useCallback,
    useContext,
    useEffect,
    // useImperativeHandle,
    useMemo,
    useRef,
  } from "react";
  import PropTypes, { InferProps } from "prop-types";
  
  import styled, { ThemeContext, ThemeProvider } from "styled-components";
  
  import { CrosswordContext, CrosswordSizeContext } from "../data/type";
  import { FocusHandler } from "../data/type";
  import Cell from "./cell";
  
  const defaultTheme = {
    columnBreakpoint: "768px",
    gridBackground: "rgb(0,0,0)",
    cellBackground: "rgb(255,255,255)",
    cellBorder: "rgb(0,0,0)",
    textColor: "rgb(0,0,0)",
    numberColor: "rgba(0,0,0, 0.25)",
    focusBackground: "rgb(255,255,0)",
    highlightBackground: "rgb(255,255,204)",
  };
  
  const GridWrapper = styled.div.attrs((/* props */) => ({
    className: "crossword grid",
  }))`
    width: auto;
    flex: 2 1 50%;
  `;
  
  const CrosswordGridPropTypes = {
    /** presentation values for the crossword; these override any values coming from a parent ThemeProvider context. */
    theme: PropTypes.shape({
      /** browser-width at which the clues go from showing beneath the grid to showing beside the grid */
      columnBreakpoint: PropTypes.string,
  
      /** overall background color (fill) for the crossword grid; can be `'transparent'` to show through a page background image */
      gridBackground: PropTypes.string,
      /**  background for an answer cell */
      cellBackground: PropTypes.string,
      /** border for an answer cell */
      cellBorder: PropTypes.string,
      /** color for answer text (entered by the player) */
      textColor: PropTypes.string,
      /** color for the across/down numbers in the grid */
      numberColor: PropTypes.string,
      /** background color for the cell with focus, the one that the player is typing into */
      focusBackground: PropTypes.string,
      /** background color for the cells in the answer the player is working on,
       * helps indicate in which direction focus will be moving; also used as a
       * background on the active clue  */
      highlightBackground: PropTypes.string,
    }),
  };
  
type CrosswordGridProps = InferProps<typeof CrosswordGridPropTypes>;

export default function OuterGrid({ theme }: CrosswordGridProps) {
    const {
      rows,
      cols,
      gridData,
      handleCellClick,
      registerFocusHandler,
      focused,
      selectedPosition: { row: focusedRow, col: focusedCol },
      selectedDirection: currentDirection,
      selectedNumber: currentNumber,
    } = useContext(CrosswordContext);
  
    const inputRef = useRef<HTMLInputElement>(null);
  
    const contextTheme = useContext(ThemeContext);
  
    // focus and movement
    const focus = useCallback<FocusHandler>(() => {
      // console.log('CrosswordGrid.focus()', { haveRef: !!inputRef.current });
      inputRef.current?.focus();
    }, []);
  
    useEffect(() => {
      // focus.name = 'CrosswordGrid.focus()';
      registerFocusHandler(focus);
  
      return () => {
        registerFocusHandler(null);
      };
    }, [focus, registerFocusHandler]);
  
    const cellSize = 20;
    const cellPadding = 2;
    const cellInner = cellSize - cellPadding * 2;
    const cellHalf = cellSize / 2;
    const fontSize = cellInner * 0.7;
  
    const sizeContext = useMemo(
      () => ({
        cellSize,
        cellPadding,
        cellInner,
        cellHalf,
        fontSize,
      }),
      [cellSize, cellPadding, cellInner, cellHalf, fontSize]
    );
  
    const height = useMemo(() => rows * cellSize, [rows]);
    const width = useMemo(() => cols * cellSize, [cols]);
    const cellWidthHtmlPct = useMemo(() => 100 / cols, [cols]);
    const cellHeightHtmlPct = useMemo(() => 100 / rows, [rows]);
  
    const inputStyle = useMemo(
      () =>
        ({
          position: "absolute",
          top: `calc(${focusedRow * cellHeightHtmlPct * 0.995}% + 2px)`,
          left: `calc(${focusedCol * cellWidthHtmlPct}% + 2px)`,
          width: `calc(${cellWidthHtmlPct}% - 4px)`,
          height: `calc(${cellHeightHtmlPct}% - 4px)`,
          fontSize: `${fontSize * 6}px`, // waaay too small...?
          textAlign: "center",
          textAnchor: "middle",
          backgroundColor: "transparent",
          caretColor: "transparent",
          margin: 0,
          padding: 0,
          border: 0,
          cursor: "default",
        } as const),
      [cellWidthHtmlPct, cellHeightHtmlPct, focusedRow, focusedCol, fontSize]
    );
    // cs
    // console.log(inputStyle);
    // console.log(gridData);
    {gridData.flatMap((rowData, row) =>
        rowData.map((cellData, col) =>(
            cellData.used ?(
              <></>
                // console.log('te',cellData)
            ): undefined
        )
    ))}

    const finalTheme = useMemo(
      () => ({ ...defaultTheme, ...contextTheme, ...theme }),
      [contextTheme, theme]
    );
  
    return (
      <CrosswordSizeContext.Provider value={sizeContext}>
        <ThemeProvider theme={finalTheme}>
          <GridWrapper>
           
            <div style={{ margin: 0, padding: 0, position: "relative" }}>
              <svg viewBox={`0 0 ${width} ${height}`}>
                <rect
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  fill={finalTheme.gridBackground || "transparent"}
                />
                {gridData.flatMap((rowData, row) =>
                  rowData.map((cellData, col) =>
                    cellData.used ? (

                      <Cell
                        key={`R${row}C${col}`}
                        cellData={cellData}
                        focus={
                          focused && row === focusedRow && col === focusedCol
                        }
                        highlight={
                          focused &&
                          !!currentNumber &&
                          cellData[currentDirection] === currentNumber
                        }
                        onClick={handleCellClick}
                      />
                    ) : undefined
                  )
                )}
              </svg>
            </div>
          </GridWrapper>
        </ThemeProvider>
      </CrosswordSizeContext.Provider>
    );
  }
  
  OuterGrid.propTypes = CrosswordGridPropTypes;
  
  OuterGrid.defaultProps = {
    theme: null,
  };
  