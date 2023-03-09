import { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './App.css';

function getTheme(themeName) {
	let result = {
		name: themeName,
		pieces: {
			light: {},
			dark: {}
		},
		bakkgroundColor: null
	};
	
	// pieces
	for (let color of ['light', 'dark'])
		for (let piece of ['king', 'queen', 'bishop', 'knight', 'rook', 'pawn'])
			result.pieces[color][piece] = require('./img/' + piece + '-' + themeName + '-' + color + '.png');
	
	// background color
	switch (themeName) {
		case 'default': result.backgroundColor = 'transparent'; break;
		case 'dark': result.backgroundColor = 'dimgray'; break;
		default: result.backgroundColor = 'red'; break;
	}
}

function Square({ value, onSquareClick, selectedPiece, index }) {
	const style = {};
	
	if (selectedPiece === index)
		style.backgroundColor = "lightblue";

	return <button className="square" onClick={onSquareClick} style={style}>{value}</button>;
}

function BoardRow({ index, onSquareClick, squares, selectedPiece }) {
	index *= 8;
	return (
		<div className="board-row">
			<Square value={squares[index]} onSquareClick={() => onSquareClick(index+0)} selectedPiece={selectedPiece} index={index} />
			<Square value={squares[index+1]} onSquareClick={() => onSquareClick(index+1)} selectedPiece={selectedPiece} index={index+1} />
			<Square value={squares[index+2]} onSquareClick={() => onSquareClick(index+2)} selectedPiece={selectedPiece} index={index+2} />
			<Square value={squares[index+3]} onSquareClick={() => onSquareClick(index+3)} selectedPiece={selectedPiece} index={index+3} />
			<Square value={squares[index+4]} onSquareClick={() => onSquareClick(index+4)} selectedPiece={selectedPiece} index={index+4} />
			<Square value={squares[index+5]} onSquareClick={() => onSquareClick(index+5)} selectedPiece={selectedPiece} index={index+5} />
			<Square value={squares[index+6]} onSquareClick={() => onSquareClick(index+6)} selectedPiece={selectedPiece} index={index+6} />
			<Square value={squares[index+7]} onSquareClick={() => onSquareClick(index+7)} selectedPiece={selectedPiece} index={index+7} />
		</div>
	);
}

function Board({ theme }) {
	const [squares, setSquares] = useState(Array(64).fill(null));
	const [selectedPiece, setSelectedPiece] = useState(null);
	const [whiteIsNext, setWhiteIsNext] = useState(true);

	squares[0] = '-';

	function handleClick(index) {
		const nextSquares = squares.slice();
		let logData = {
			selectedPiece: selectedPiece ? { x: selectedPiece % 8, y: Math.floor(selectedPiece / 8) } : null,
			position: index ? { x: index % 8, y: Math.floor(index / 8) } : null,
			selectedValue: selectedPiece ? squares[selectedPiece] : null,
			value: index ? squares[index] : null,
			raw: {
				index: index,
				squares: squares,
				selectedPiece: selectedPiece
			},
			conditions: {
				_0_unselect: Boolean(selectedPiece === index),
				_1_select: Boolean(selectedPiece === null && squares[index] !== null),
				_2_move: Boolean(squares[index] !== null)
			}
		};
		logData.conditions.select &= !logData.unselect;
		logData.conditions.move &= logData.select;
		console.log("board click update", logData);
		if (selectedPiece === index) {
			console.log("unselecting piece");
			setSelectedPiece(null);
		}
		else if (selectedPiece === null)
			if (squares[index] !== null) {
				console.log("selecting piece");
				setSelectedPiece(index);
			}
		else if (squares[index] === null) {
			console.log("moving piece");
			nextSquares[selectedPiece] = null;
			nextSquares[index] = squares[selectedPiece];
			setSelectedPiece(null);
		}
		setSquares(nextSquares);
	}

	return (
		<div className="board">
			<BoardRow index='0' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} />
			<BoardRow index='1' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} />
			<BoardRow index='2' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} />
			<BoardRow index='3' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} />
			<BoardRow index='4' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} />
			<BoardRow index='5' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} />
			<BoardRow index='6' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} />
			<BoardRow index='7' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} />
		</div>
	);
}

function App() {
	const theme = getTheme('dark');
	return (
		<HelmetProvider>
			<div className="App" backgroundColor={theme.backgroundColor}>
				<Helmet>
					<title>Chess No. 25</title>
				</Helmet>
				<Board theme={theme}/>
			</div>
		</HelmetProvider>
	);
}

export default App;
