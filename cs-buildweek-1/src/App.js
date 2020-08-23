import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import "./App.css";

const numRows = 25;
const numColumns = 25;

//to check neighbors across the grid
const neighborOps = [
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const emptyGrid = () => {
  const rows = [];
  //creating grid
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numColumns), () => 0));
  }
  return rows;
}

function App() {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const[grid, setGrid] = useState(() => {
    return emptyGrid();
  });

  //our current value for the running state
  const runningRef = useRef(running);
  runningRef.current = running;

  const runGame = useCallback(() => {
    //if not running then end the function
    if (!runningRef.current) {
      return;
    }

    //else call the function recursively to update
    setGrid((g) => {
      //current grid is set to g
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numColumns; j++) {
            //figure out how many neighbors each cell has
            let neighbors = 0;
            neighborOps.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              //checking to make sure you don't go out of bounds
              if (
                newI >= 0 &&
                newI < numRows &&
                newJ >= 0 &&
                newJ < numColumns
              ) {
                neighbors += g[newI][newJ];
              }
            });
            //if current cell is dead but has 3 neighbors then it comes alive
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(runGame, speed);
  }, []);
  
  return (
    <div class="page-container">
      <h1>Conway's Game of Life</h1>
      <h3>by Jason Belgard</h3>
      <div
        class="grid-display"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numColumns}, 20px`,
        }}
      >
        {/* this creates the grid by mapping over our rows. i is the index of the rows and c is the index for the columns */}
        {grid.map((rows, i) => 
        rows.map((col, c) => (
          <div
            key={`${i}-${c}`}
            //this sets the index of the clicked grid to alive
            onClick={() => {
              const newGrid = produce(grid, (gridCopy) => {
                gridCopy[i][c] = grid[i][c] ? 0 : 1;
              });
              setGrid(newGrid);
            }}
            style={{
              width: 20,
              height: 20,
              backgroundColor: grid[i][c] ? "black" : undefined,
              border: "solid 1px black",
            }}
          />
        ))
        )}
      </div>
      <div class="button-container">
        <button
          onClick={() => {
            if (speed <= 5000) {
              setSpeed(speed + 100);
              console.log(speed);
            }
          }}
        >
          <i class="fas fa-backward" />
        </button>
            {/* changes the sate to determine if it's running or not */}
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runGame();
            }
          }}        
        >
          {running ? <i class="fas fa-pause" /> : <i class="fas fa-play" />}
        </button>
        <button
          onClick={() => {
            if (speed >= 100) {
              setSpeed(speed - 100);
              console.log(speed);
            }
          }}
        >
          <i class="fas fa-fast-forward" />
        </button>
        <button
          onClick={() => {
            setGrid(emptyGrid());
          }}
        >
          <i class="fas fa-redo" />
        </button>
        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numColumns), () => 
                  Math.random() > 0.8 ? 1 : 0
                )
              );
            }
            setGrid(rows);
          }}
        >
          <i class="fas fa-question" />
        </button>
      </div>
      <div class="description">
        <div>
          <h2>Description on what's going on</h2>
          <ul>
            <li>Rule 1: Any live cell with 2 or 3 live neighbors survives.</li>
            <li>Rule 2: Any dead cell with 3 live neighbors comes back to life.</li>
            <li>Rule 3: All other live cells die in the next generation.  Similarly, all other dead cells stay dead.</li>
          </ul>
        </div>
      </div>
      <div class="description">
        <div>
          <h2>Instructions</h2>
          <ul>
            <li> Click on any cell to make it "alive"</li>
            <li>Click play to see how it all plays out</li>
            <li>Change the speed, and even create a random simulation using the buttons.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;