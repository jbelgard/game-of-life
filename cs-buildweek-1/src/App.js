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
    setTimeout(runGame, 250);
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
    </div>
  );
}

export default App;