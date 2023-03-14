import { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { Theme, getImage } from './Theme';
import * as gameLogic from './gameLogic.js';
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

function Board({ theme, data, onPlay }) {
	
	console.log('render data write', data);

	const history = data.history;
	const setHistory = data.setHistory;
	const [selectedPiece, setSelectedPiece] = useState(null);
	const [lightIsNext, setLightIsNext] = useState(true);
	const squares = data.history[data.currentMove].slice();
	
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
		logData.conditions._1_select &= !logData.conditions._0_unselect;
		logData.conditions._2_move &= logData.conditions._1_select;
		console.log("board click update", logData);
		if (selectedPiece === index) {
			console.log("unselecting piece");
			setSelectedPiece(null);
		}
		else if (selectedPiece === null && squares[index] !== null) {
			console.log("selecting piece");
			setSelectedPiece(index);
		}
		else if (gameLogic.canBeMoved(selectedPiece, index, squares)) {
			console.log("moving piece");
			nextSquares[selectedPiece] = null;
			nextSquares[index] = squares[selectedPiece];
			onPlay(selectedPiece, index, nextSquares);
			setSelectedPiece(null);
		}
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

function Game({ theme, data }) {
	const reRender = useState(0)[1];

	function handlePlay(from, to, nextSquares) {
		const nextHistory = [...data.history.slice(0, data.currentMove + 1), nextSquares];
		data.setHistory(nextHistory);
		data.setCurrentMove(nextHistory.length - 1);
		reRender(Math.random());
	}

	function undoMove() {
		const nextHistory = data.history;
		nextHistory.pop();
		data.setHistory(nextHistory);
		data.setCurrentMove(data.currentMove - 1);
		reRender(Math.random());
	}

	return (
		<div className="game" style={theme.game.style}>
			<Board theme={theme} data={data} onPlay={handlePlay} />
			<Button className="menu-button" onClick={undoMove} variant="contained" color="primary" disabled={data.history.length <= 1}>Undo</Button>
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
				<Game theme={theme} data={setupData} />
			</div>
		</HelmetProvider>
	);
}

function setupData(theme) {
	this.type = "chessdata";
	this.history = [Array(64).fill(null)];
	this.setHistory = (s) => this.history = s;
	this.currentMove = 0;
	this.setCurrentMove = (s) => this.currentMove = s;
	
	for (let color of ['light', 'dark']) {
		let row = Array(8).fill(null);
		row[0] = getImage(theme.getPiece(color, 'rook'));
		row[1] = getImage(theme.getPiece(color, 'knight'));
		row[2] = getImage(theme.getPiece(color, 'bishop'));
		row[3] = getImage(theme.getPiece(color, 'queen'));
		row[4] = getImage(theme.getPiece(color, 'king'));
		row[5] = getImage(theme.getPiece(color, 'bishop'));
		row[6] = getImage(theme.getPiece(color, 'knight'));
		row[7] = getImage(theme.getPiece(color, 'rook'));
		for (let i = 0; i < 8; i++) {
			this.history[0][(color === 'dark') ? i : (i + 56)] = row[i];
			this.history[0][(color === 'dark') ? (i + 8) : (i + 48)] = getImage(theme.getPiece(color, 'pawn'));
		}
	}
}

export { setupData };
export default App;
