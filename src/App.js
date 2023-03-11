import { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Theme, getImage } from './Theme'
import './App.css';

function Square({ value, onSquareClick, selectedPiece, index }) {
	const isDark = ((Math.floor(index / 8) % 2) !== (index % 2));
	const style = {
		backgroundColor: isDark ? "lightgray" : "transparent"
	};
	
	if (selectedPiece === index) {
		style.backgroundColor = isDark ? "darkred" : "lightblue";
		console.log(`piece${index}:selected`);
	}

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

function Board({ theme, data }) {
	const squares = data.squares;
	const setSquares = data.setSquares;
	const [selectedPiece, setSelectedPiece] = useState(null);
	const [lightIsNext, setLightIsNext] = useState(true);
	
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
		else if (selectedPiece === null && squares[index] !== null) {
			console.log("selecting piece");
			setSelectedPiece(index);
		}
		else if (squares[index] === null && selectedPiece !== null) {
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

function App({ setupData }) {
	const theme = new Theme('default');
	return (
		<HelmetProvider>
			<div className="App" style={theme.style}>
				<Helmet>
					<title>Chess No. 25</title>
				</Helmet>
				<Board theme={theme} data={setupData} />
			</div>
		</HelmetProvider>
	);
}

function setupData(theme) {
	this.type = "chessdata";
	this.squares = Array(64).fill(null);
	this.setSquares = (s) => this.squares = s;

	this.squares[0] = getImage(theme.getPiece('dark', 'rook'));
	this.squares[1] = getImage(theme.getPiece('dark', 'knight'));
	this.squares[2] = getImage(theme.getPiece('dark', 'bishop'));
	this.squares[3] = getImage(theme.getPiece('dark', 'queen'));
	this.squares[4] = getImage(theme.getPiece('dark', 'king'));
	this.squares[5] = getImage(theme.getPiece('dark', 'bishop'));
	this.squares[6] = getImage(theme.getPiece('dark', 'knight'));
	this.squares[7] = getImage(theme.getPiece('dark', 'rook'));
	this.squares[56+0] = getImage(theme.getPiece('light', 'rook'));
	this.squares[56+1] = getImage(theme.getPiece('light', 'knight'));
	this.squares[56+2] = getImage(theme.getPiece('light', 'bishop'));
	this.squares[56+3] = getImage(theme.getPiece('light', 'queen'));
	this.squares[56+4] = getImage(theme.getPiece('light', 'king'));
	this.squares[56+5] = getImage(theme.getPiece('light', 'bishop'));
	this.squares[56+6] = getImage(theme.getPiece('light', 'knight'));
	this.squares[56+7] = getImage(theme.getPiece('light', 'rook'));
}

export { setupData };
export default App;
