import styled from "styled-components";


export const CrosswordMessageBlock = styled.div`
  display: flex;
  gap: 3em;
`;
export const themeGrip = {
  allowNonSquare: true,
  columnBreakpoint: '9999px',
  gridBackground: '#fff',
  cellBackground: '#fff',
  cellBorder: '#DADADA',
  textColor: '#000',
  numberColor: 'transparent',
  focusBackground: '#00FFFF ',
  highlightBackground: '#99FFFF',
}
export const themeGripIncorect = {
  allowNonSquare: true,
  columnBreakpoint: '9999px',
  gridBackground: '#fff',
  cellBackground: '#f99',
  cellBorder: '#e8e8e8',
  textColor: '#000',
  numberColor: '#9f9',
  focusBackground: '#f00',
  highlightBackground: '#f99',
}
export const themeGripCorect = {
  allowNonSquare: true,
  columnBreakpoint: '9999px',
  gridBackground: '#fff',
  cellBackground: 'green',
  cellBorder: '#DADADA',
  textColor: '#000',
  numberColor: '#9f9',
  focusBackground: '#fff',
  highlightBackground: '#f99',
}
export const CrosswordWrapper = styled.div`

  /* and some fun making use of the defined class names */
  .crossword.correct {
    rect {
      stroke: rgb(100, 200, 100) !important;
    }
    svg > rect {
      fill: rgb(100, 200, 100) !important;
    }
    text {
      fill: rgb(100, 200, 100) !important;
    }
  }

  .clue.correct {
    ::before {
      content: '\u2713'; /* a.k.a. checkmark: ✓ */
      display: inline-block;
      text-decoration: none;
      color: rgb(100, 200, 100);
      margin-right: 0.25em;
    }

    text-decoration: line-through;
    color: rgb(130, 130, 130);
  }
`;
