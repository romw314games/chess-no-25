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

function Square({ value, onSquareClick, selectedPiece, index, theme, squares }) {
	const isDark = ((Math.floor(index / 8) % 2) !== (index % 2));
	const color = isDark ? theme.square.darkColor : theme.square.lightColor;
	const style = {
		backgroundColor: color[0]
	};

	if (selectedPiece)
		style.backgroundColor = color[Number(selectedPiece === index) + (Number(selectedPiece && gameLogic.canBeMoved(selectedPiece, index, squares)) * 2)]

	console.dlog(4, 'render square log', {
		value: value,
		onSquareClick: onSquareClick,
		selectedPiece: selectedPiece,
		index: index,
		theme: theme,
		global: global,
		setGlobal: (n, v) => global[n] = v,
		squares: squares
	});
	
	value = global.sqValue ? eval(global.sqValue) : getImage(value);

	return <button className="unselectable square" onClick={onSquareClick} style={style}>{value}</button>;
}

function BoardRow({ index, onSquareClick, squares, selectedPiece, theme }) {
	index *= 8;
	return (
		<div className="board-row">
			<Square value={squares[index]} onSquareClick={() => onSquareClick(index+0)} selectedPiece={selectedPiece} index={index} theme={theme} squares={squares} />
			<Square value={squares[index+1]} onSquareClick={() => onSquareClick(index+1)} selectedPiece={selectedPiece} index={index+1} theme={theme} squares={squares} />
			<Square value={squares[index+2]} onSquareClick={() => onSquareClick(index+2)} selectedPiece={selectedPiece} index={index+2} theme={theme} squares={squares} />
			<Square value={squares[index+3]} onSquareClick={() => onSquareClick(index+3)} selectedPiece={selectedPiece} index={index+3} theme={theme} squares={squares} />
			<Square value={squares[index+4]} onSquareClick={() => onSquareClick(index+4)} selectedPiece={selectedPiece} index={index+4} theme={theme} squares={squares} />
			<Square value={squares[index+5]} onSquareClick={() => onSquareClick(index+5)} selectedPiece={selectedPiece} index={index+5} theme={theme} squares={squares} />
			<Square value={squares[index+6]} onSquareClick={() => onSquareClick(index+6)} selectedPiece={selectedPiece} index={index+6} theme={theme} squares={squares} />
			<Square value={squares[index+7]} onSquareClick={() => onSquareClick(index+7)} selectedPiece={selectedPiece} index={index+7} theme={theme} squares={squares} />
		</div>
	);
}

function Board({ theme, data, onPlay }) {
	console.dlog(3, 'render data write', data);

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
		console.dlog(1, "board click update", logData);
		if (selectedPiece === index) {
			console.dlog(2, "unselecting piece");
			setSelectedPiece(null);
		}
		else if (selectedPiece === null && squares[index] !== null) {
			console.dlog(2, "selecting piece");
			setSelectedPiece(index);
		}
		else if (selectedPiece !== null && gameLogic.canBeMoved(selectedPiece, index, squares)) {
			console.dlog(2, "moving piece");
			nextSquares[selectedPiece] = null;
			nextSquares[index] = squares[selectedPiece];
			onPlay(selectedPiece, index, nextSquares);
			setSelectedPiece(null);
		}
	}

	return (
		<div className="board" style={theme.board.style}>
			<BoardRow index='0' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} theme={theme} />
			<BoardRow index='1' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} theme={theme} />
			<BoardRow index='2' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} theme={theme} />
			<BoardRow index='3' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} theme={theme} />
			<BoardRow index='4' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} theme={theme} />
			<BoardRow index='5' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} theme={theme} />
			<BoardRow index='6' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} theme={theme} />
			<BoardRow index='7' onSquareClick={handleClick} squares={squares} selectedPiece={selectedPiece} theme={theme} />
		</div>
	);
}

function Game({ theme, data }) {
	const reRender = useState(0)[1];
	const [promoting, setPromoting] = useState(null);

	console.dlog = (level, ...args) => {
		if (global.uselog && global.uselog >= level)
			console.log(...args);
	}

	function handlePlay(from, to, nextSquares, overwrite) {
		for (let i = 0; i < nextSquares.length; i++) {
			console.dlog(4, `light promotion test testing piece at ${i}`, nextSquares[i]);
			if (nextSquares[i] && ((i < 8 && nextSquares[i].fullName === 'light pawn') || (i >= 56 && nextSquares[i].fullName === 'dark pawn'))) {
				console.dlog(1, 'promotion data write', data);
				setPromoting(i);
			}
		}
		let nextHistory;
		if (overwrite) {
			nextHistory = data.history.slice();
			nextHistory[data.currentMove] = nextSquares;
		}
		else nextHistory = [...data.history.slice(0, data.currentMove + 1), nextSquares];
		data.setHistory(nextHistory);
		data.setCurrentMove(nextHistory.length - 1);
		reRender(Math.random());
	}

	function promotePiece(index, piece) {
		console.dlog(1, `promoting pawn on ${index} to ${piece}`);
		const nextSquares = data.history[data.currentMove].slice();
		nextSquares[index] = theme.getPiece(index < 8, piece);
		handlePlay(index, index, nextSquares, true);
		setPromoting(null);
	}

	const promotions = {};
	for (let promotion of ['queen', 'rook', 'bishop', 'knight'])
		promotions[promotion] = () => promotePiece(promoting, promotion);

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
			<Dialog open={Boolean(promoting) || (promoting === 0)}>
				<DialogTitle>Promotion</DialogTitle>
				<DialogContent><DialogContentText>Please select piece:</DialogContentText></DialogContent>
				<DialogActions>
					<Button color="primary" onClick={promotions.queen}>Queen</Button>
					<Button color="primary" onClick={promotions.rook}>Rook</Button>
					<Button color="primary" onClick={promotions.bishop}>Bishop</Button>
					<Button color="primary" onClick={promotions.knight}>Knight</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

function App({ setupData }) {
	const theme = setupData.theme;
	const reRender = useState(0)[1];

	global.reredner = global.rr = () => {
		reRender(Math.random());
		return 're-redner trigerred';
	};
	global.sqv = (s) => {
		global.sqValue = s;
		reRender(Math.random());
		return `global.sqValue set to ${s} : re-render trigerred`;
	}

	global.loglevel = (s) => {
		if (s) {
			global.uselog = s;
			return `global.uselog set to ${s}`;
		}
		return global.uselog;
	}

	global.debugLogOption = () => {
		console.log(`set debug logging:
@
	right-click on the object -> store object as global variable
	call the stored object's function loglevel (eg. temp1.loglevel), it takes one parameter, the new log level.
	log level null or any other falsy value is no debug logging (default).
@
@
@
set any global variable:
@
	right-click on the object -> store object as global variable
	call the stored object's function setGlobal (eg. temp1.setGlobal), it takes two parameters - global name (eg. sqValue) and the new value (eg. index).
@
@
@
re-render the game:
@
	right-click on the object -> store object as global variable
	call the stored object's function reRender (eg. temp1.reRender), it does not take parameters.
@
@
@`, {
			loglevel: (p) => global.uselog = p,
			setGlobal: (n, v) => global[n] = v,
			reRender: () => reRender(Math.random())
		});
	}

	return (
		<HelmetProvider>
			<div className="App" style={theme.style}>
				<Helmet>
					<title>Chess No. 25</title>
				</Helmet>
				<h1 className="unselectable">Chess No. 25</h1>
				<Game theme={theme} data={setupData} />
			</div>
		</HelmetProvider>
	);
}

function DefaultApp() {
	return <App setupData={new setupData(new Theme('default'))} />;
}

function setupData(theme) {
	this.type = "chessdata";
	this.history = [Array(64).fill(null)];
	this.setHistory = (s) => this.history = s;
	this.currentMove = 0;
	this.setCurrentMove = (s) => this.currentMove = s;
	this.theme = theme;
	
	for (let color of ['light', 'dark']) {
		let row = Array(8).fill(null);
		row[0] = theme.getPiece(color, 'rook');
		row[1] = theme.getPiece(color, 'knight');
		row[2] = theme.getPiece(color, 'bishop');
		row[3] = theme.getPiece(color, 'queen');
		row[4] = theme.getPiece(color, 'king');
		row[5] = theme.getPiece(color, 'bishop');
		row[6] = theme.getPiece(color, 'knight');
		row[7] = theme.getPiece(color, 'rook');
		for (let i = 0; i < 8; i++) {
			this.history[0][(color === 'dark') ? i : (i + 56)] = row[i];
			this.history[0][(color === 'dark') ? (i + 8) : (i + 48)] = theme.getPiece(color, 'pawn');
		}
	}
}

export { setupData, DefaultApp };
export default App;
