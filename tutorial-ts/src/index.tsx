import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// ========================================

type SquareValue = 'X' | 'O' | null
type SquareHandleClick = () => void
type SquareValues = SquareValue[]
type HandleClick = (i: number) => void
type historySquareValues = {squares: SquareValues}[]
type historyStates = {
    history: historySquareValues,
    stepNumber: number,
    xIsNext: boolean
}

type SquareProps = {
    value: SquareValue
    onClick: SquareHandleClick
}
type BoardProps = {
    squares: SquareValues,
    onClick: HandleClick
}
type GameProps = {}

// ========================================

const Square: React.FC<SquareProps> = props => {
    return (
    <button className="square" onClick={()=>props.onClick()}>
        { props.value }
    </button>   
    );
}

const Board: React.FC<BoardProps> = props => {

    const renderSquare = (i: number) => {
        return (
        <Square 
            value={props.squares[i]} 
            onClick={()=>props.onClick(i)}
        />
        );
    }
    
    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}

const Game: React.FC<GameProps> = props => {
    const [state, setState] = useState<historyStates>({
        history: [{squares: Array(9).fill(null)}],
        stepNumber: 0,
        xIsNext: true
    })

    const history = state.history;
    const current = history[state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
        const desc = move ?
            'Go to move #' + move :
            'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => {
                    setState({
                        history: state.history,
                        stepNumber: move, 
                        xIsNext: (move % 2) === 0
                    })
                }}>{desc}</button>
            </li>
        );
    });

    let status: string;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (state.xIsNext ? 'X': 'O');
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i: number) => {
                        const history = state.history;
                        const current = history[history.length - 1];
                        const squares = current.squares.slice();
                        if (calculateWinner(squares) || squares[i]) {
                            return;
                        }
                        squares[i] = state.xIsNext ? 'X': 'O';
                        setState({
                            history: history.concat([{
                                squares: squares
                            }]),
                            stepNumber: history.length,
                            xIsNext: !state.xIsNext
                        });
                    }}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{ moves }</ol>
            </div>
        </div>
    );
}

// ========================================
const calculateWinner = (squares: SquareValues): SquareValue => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      for (const line of lines) {
          const [a, b, c] = line;
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
              return squares[a];
            }
      }

      return null
}


// ========================================

ReactDOM.render(
   <Game />,
   document.getElementById('root')
);