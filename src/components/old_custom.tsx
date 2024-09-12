/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CrosswordProviderImperative,
  ThemeProvider,
  useIpuz,
} from "@jaredreisinger/react-crossword";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createDataTableCross } from "../data/createDataTableCross";
import {
  cluesData,
  guessData,
  puzzleData,
  solutionData,
} from "../data/ipuzData";
import { CrosswordWrapper, themeGrip } from "../assets/styles/style";
import CrosswordGrid from "./crossWord";
import CrosswordProvider, { CrosswordProviderProps } from "./crossProvider";
import DirectionClues from "./directionClues";
import { ThemeContext } from "styled-components";

const CrosswordComponent: React.FC = React.memo(() => {

  const [isCheckActive, setCheckActive] = useState<boolean>(false);

  // const [isCorrect, setCorrect] = useState<string>('0');
  const isCorrect = useRef<string>('0');

  // const [numCheck, setNumCheck] = useState<string>("")
  const numCheck = useRef<string>("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message, setMessage] = useState<string>("Type your answer");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messageBot, setMessageBot] = useState<string>("Check");


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isWordCorrect, setWordCorrect] = useState<boolean>(false);
  const [isAcross, setAcross] = useState<boolean>(true);
  const crosswordProvider = useRef<CrosswordProviderImperative>(null);

  const fromIpuz = useIpuz(
    createDataTableCross(puzzleData, cluesData, solutionData)
  );

  const CheckAns = () => {
   
    const listCorrect = document.getElementsByClassName('clue correct');
    for (const element of listCorrect) {
      if (element?.getAttribute('aria-label')?.includes(numCheck.current.toString())) {
        // setNumCheck('noRow')
        numCheck.current = 'noRow';
        return true;
      }
    }

    return false;
  };

  const CheckClick =()=>{
    if(!isCheckActive){
      // Chọn phần tử dựa trên class
      const elementG = document.querySelector('.crossword.grid') as HTMLElement;
      const elementC = document.querySelector('.shadows.correct') as HTMLElement;
      const check = CheckAns();
      // Thêm thuộc tính pointer-events: none;
      if (elementG && elementC) {
        elementG.style.pointerEvents = 'none';
        elementC.style.pointerEvents = 'none';
      }
      if(check)
          {
            // setCorrect('1')
            isCorrect.current = '1';
          } else{
            // setCorrect('2')
            isCorrect.current = '2';
          }
      setCheckActive(true)

    } else{
      // Chọn phần tử dựa trên class
      const elementG = document.querySelector('.crossword.grid') as HTMLElement;
      const elementC = document.querySelector('.shadows.correct') as HTMLElement;
      // Thêm thuộc tính pointer-events: none;
      if (elementG && elementC) {
        elementG.style.pointerEvents = '';
        elementC.style.pointerEvents = '';
      }
      isCorrect.current = '0'
      setCheckActive(false)
    }

    // const correctTextElements = document.querySelectorAll('text.guess-text-correct');

    //   // Duyệt qua các phần tử này và tìm <rect> liền kề với chúng
    //   correctTextElements.forEach((textElement) => {
    //     const parentGroup = textElement.closest('g'); // Tìm phần tử <g> cha
    //     if (parentGroup) {
    //       const rectElement = parentGroup.querySelector('rect'); // Tìm <rect> trong <g>
    //       if (rectElement) {
    //         rectElement.setAttribute('fill', 'red'); // Thay đổi fill thành 'red'
    //       }
    //     }
    //   });

 
    // setCheckActive(true);
    // const check = CheckAns();

    // if(checkActive)
    // {
    //   if(check)
    //   {
    //     // setCorrect('1')
    //     isCorrect.current = '1';
    //   } else{
    //     // setCorrect('2')
    //     isCorrect.current = '2';
    //   }
    // } else{
    //   // setCorrect('0')
    //   isCorrect.current = '0'
    // }
  }

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

  const setGuessTable = useCallback(async () => {
    if (guessData) {
      await guessData.map((guess) => {
        crosswordProvider.current?.setGuess(guess.row, guess.col, guess.guess);
      });
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fillAllAnswersProvider = useCallback(async () => {
    crosswordProvider.current?.fillAllAnswers();
  }, []);

  // const onCellChangeProvider = useCallback<
  //   Required<CrosswordProviderProps>['onCellChange']
  // >(
  //   () => {
    
  //   },[]
  // );

  // on clue change
  const onClueSelected = useCallback<Required<CrosswordProviderProps>['onClueSelected']>(
    (direct, number) => {
      numCheck.current = number.toString().trim();
    },[]
  );

  const setTransparent = () =>{
    const redFillElements = document.querySelectorAll('[style*="fill: red;"]');
    if(redFillElements)
    {
      // Duyệt qua các phần tử này và tìm <rect> liền kề với chúng
      redFillElements.forEach((textElement) => {
        const parentGroup = textElement.closest('g'); // Tìm phần tử <g> cha
        if (parentGroup) {
          const rectElement = parentGroup.querySelector('rect'); // Tìm <rect> trong <g>
          if (rectElement) {
            rectElement.setAttribute('fill', 'transparent'); // Thay đổi fill thành 'red'
          }
        }
      });
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setGuessTable();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [setGuessTable]); 

  
  

  const currentTheme = {
    ...themeGrip,
    highlightBackground: 
      isCorrect.current === '1' ? '#54D62C' : 
      isCorrect.current === '2' ? 'red' : '#99FFFF',
    
    focusBackground: 
      isCorrect.current === '1' ? '#54D62C' : 
      isCorrect.current === '2' ? 'red' : '#00FFFF',
  };
    // Hàm để cập nhật theme mà không render lại component
  const contextTheme = useContext(ThemeContext);
  const finalTheme = useMemo(
    () => ({ ...defaultTheme, ...contextTheme, ...currentTheme }),
    [contextTheme, currentTheme]
  );


  return (
    <>
      <div className="header-game">
        <div className="header-icon" />
        <h2 className="header-title">🍅 Crossword</h2>
      </div>
      <ThemeProvider theme={finalTheme}>
        <CrosswordWrapper className="cover">
          <CrosswordProvider 
            theme={finalTheme} 
            ref={crosswordProvider} 
            data={fromIpuz!} 
            onClueSelected={onClueSelected}
            >            
            <CrosswordGrid />
            <div className="shadows correct">
              <button
                className={`btn ${isAcross ? "active-btn" : ""}`}
                onClick={() => {
                  setAcross(true);
                }}
              >
                Across
              </button>
              <button
                className={`btn ${isAcross ? "" : "active-btn"}`}
                onClick={() => {
                  setAcross(false);
                }}
              >
                Down
              </button>

              {isAcross ? (
                <DirectionClues direction="across" />
              ) : (
                <DirectionClues direction="down" />
              )}
            </div>

          </CrosswordProvider>
        </CrosswordWrapper>
      </ThemeProvider>

      <div className="footer">
        <h3>{message}</h3>
        <button
          onClick={() => CheckClick()}
          className={`${isCheckActive ? "check" : "check-no"}`}
          // disabled = {(isCheckActive)}
        >
          {messageBot}
        </button>
      </div>
    </>
  );
});

export default CrosswordComponent;
