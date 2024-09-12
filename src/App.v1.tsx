import  
// Crossword, 
{ 
  CrosswordGrid, 
  CrosswordProvider, 
  DirectionClues, 
  ThemeProvider, 
  useIpuz 
} from "@jaredreisinger/react-crossword";
import { CrosswordMessageBlock, CrosswordWrapper, themeGrip, themeGripIncorect } from "./assets/styles/style";
import { createDataTableCross } from "./data/createDataTableCross";
import { cluesData, puzzleData, solutionData } from "./data/ipuzData";
import { 
   useState } from "react";
function App() {
  const fromIpuz = useIpuz(
    createDataTableCross(puzzleData, cluesData, solutionData)
  );
  const [isAcross, setAcross] = useState<boolean>(true);
  const [isCheckActive, setCheckActive] = useState<boolean>(false);
  
  const [message, setMessage] = useState<string>('check');

  const CheckAns = () => {
      setCheckActive(!isCheckActive)
      setMessage('Try a again ')
     }

  return (
    <div className="container">
      <CrosswordMessageBlock >
        <CrosswordWrapper  className={`cover ${isCheckActive ? 'incorrect ' : 'viewClue'}`}>
          <ThemeProvider theme={isCheckActive ? themeGripIncorect : themeGrip}
          >          
             <CrosswordProvider  
            data={fromIpuz!} 
            storageKey="ipuz-example"
            // onClueSelected={onClueSelected}
            >              
                <CrosswordGrid
                />
                <div className="shadows correct">
                  <button className={`btn ${isAcross ? 'active-btn' : ''}`} onClick={()=>{
                    setAcross(true)
                  }}>Across</button>
                  <button className={`btn ${isAcross ? '' : 'active-btn'}`} onClick={()=>{
                    setAcross(false)
                  }}>Down</button>

                  {isAcross ? (
                    <DirectionClues direction="across" />
                  ) :(
                    <DirectionClues direction="down" />
                  )}
                </div>
            </CrosswordProvider>
          </ThemeProvider>
        </CrosswordWrapper>
      </CrosswordMessageBlock>

{/*  */}
      <div className="footer">
         <h3>{message}</h3>
         <button onClick={()=>CheckAns()} className={`${isCheckActive ? 'check' : 'check-no'}`}>{message}</button>         
      </div>
    </div>
  );
}

export default App;
