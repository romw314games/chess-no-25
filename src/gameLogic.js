import { getLg } from './DebugRunContext';
import clone from 'just-clone';

const index2pos = (index) => { return { x: index % 8, y: Math.floor(index / 8) }; };
const pos2index = (x, y) => (y === undefined) ? pos2index(x.x, x.y) : (x + y * 8);

function getSquare(squares, x, y) {
	return squares[pos2index(x, y)];
}

function whereCanMove(move, squares, piece, x, y, realMove) {
	if (y === undefined) return whereCanMove(move, squares, x.x, x.y, realMove);

	const result = [];

	const square = (x, y) => getSquare(squares, x, y);
	const add = (x, y, doMoveExtra) => result.push([pos2index(x, y), doMoveExtra ?? (function() {})]);
	const emptyForPlayer = (x, y) => !square(x, y) || (square(x, y).player !== piece.player);
	const addIfEmptyExt = (x, y, ext, isEmpty, dme) => {
		isEmpty ??= emptyForPlayer;
		if (ext && isEmpty(x, y)) add(x, y, dme);
	};
	const addIfEmpty = (x, y, isEmpty, dme) => addIfEmptyExt(x, y, true, isEmpty, dme);
	const addAllIfEmpty = (all, dmeall) => {
		for (let [x, y] of all)
			addIfEmptyExt(x, y, isValidPosition(x, y), emptyForPlayer, dmeall);
	}
	const addAllIfEmptyRelative = (all, dmeall) => addAllIfEmpty(all.map(pos => [pos[0] + x, pos[1] + y]), dmeall);
	const isValidPosition = (x, y) => {
		const range = [...Array(8).keys()];
		return range.includes(x) && range.includes(y);
	};
	const pawnCapture = (x, y) => emptyForPlayer(x, y) && square(x, y);
	const queenMovement = (dirs) => {
		for (let [dirX, dirY] of dirs) {
			let tempX, tempY, count = 0;
			for ([tempX, tempY] = [x, y]; isValidPosition(tempX, tempY) && ((square(tempX, tempY) === null) || !count); [tempX, tempY, count] = [tempX + dirX, tempY + dirY, count + 1])
				add(tempX, tempY);
			console.dlog(getLg(), 4, "testing qm tempresult log 1 / whereCanMove", { $tempPos: [tempX, tempY], $pos: [x, y], $result: result.map(index2pos).map(obj => [obj.x, obj.y]), result: result, dir: [dirX, dirY] });
			addIfEmptyExt(tempX, tempY, isValidPosition(tempX, tempY));
			console.dlog(getLg(), 3, "testing qm tempresult log 2 / whereCanMove", { $pos: [x, y], $result: result.map(index2pos).map(obj => [obj.x, obj.y]), result: result, dir: [dirX, dirY] });
		}
	}

	window._gameLogic ??= {};
	window._gameLogic.whereCanMove ??= {
		castling: {
			light: {
				kingside: true,
				queenside: true
			},
			dark: {
				kingside: true,
				queenside: true,
			}
		}
	};
	
// eslint-disable-next-line default-case
	switch (piece.name) {
		case 'pawn':
			addIfEmpty(x, piece.utils.forward(y, 1), (x, y) => !square(x, y));
			addIfEmptyExt(x, piece.utils.forward(y, 2), y === piece.colorVal(6, 1) && (square(x, piece.utils.forward(y, 1)) === null), (x, y) => !square(x, y));
			addIfEmptyExt(x + 1, piece.utils.forward(y, 1), x !== 7, pawnCapture);
			addIfEmptyExt(x - 1, piece.utils.forward(y, 1), x !== 0, pawnCapture);
			break;
		case 'knight':
			addAllIfEmptyRelative([
				[1, 2],
				[2, 1],
				[-1, 2],
				[-2, 1],
				[-1, -2],
				[-2, -1],
				[1, -2],
				[2, -1]
			]);
			break;
		case 'king':
			addAllIfEmptyRelative([
				[0, 1],
				[1, 0],
				[0, -1],
				[-1, 0],
				[1, 1],
				[1, -1],
				[-1, -1],
				[-1, 1]
			], realMove ? (() => window._gameLogic.whereCanMove.castling[piece.player] = { kingside: move, queenside: move }) : () => {});
			let canCastle = window._gameLogic.whereCanMove.castling[piece.player];
			for (const castling in canCastle)
				if (typeof(canCastle[castling]) === 'number')
					canCastle[castling] = canCastle[castling] > move;
			const home = (piece.player === 'light') ? 7 : 0;
			if (canCastle.kingside && !square(5, home) && !square(6, home))
				add(6, 7, setSquare => {
					setSquare(pos2index(5, home), square(7, home));
					setSquare(pos2index(7, home), null);
				});
			if (canCastle.queenside && !square(3, home) && !square(2, home) && !square(1, home))
				add(2, home, setSquare => {
					setSquare(pos2index(3, home), square(0, home));
					setSquare(pos2index(0, home), null);
				});
			break;
		case 'queen':
		case 'rook':
			queenMovement([[1, 0], [0, 1], [-1, 0], [0, -1]]);
			if (piece.name === 'rook')
				break;
// eslint-disable-next-line no-fallthrough
		case 'bishop':
			queenMovement([[1, 1], [-1, 1], [-1, -1], [1, -1]]);
			break;
	}

	console.dlog(getLg(), 3, "whereCanMove: test end", result);

	return result;
}

function canBeMovedInternal(move, selectedPiece, endIndex, squares, realMove) {
	if (endIndex === selectedPiece)
		return [false, null];
	const type = squares[selectedPiece].name;
	if (!['pawn', 'knight', 'king', 'rook', 'queen', 'bishop'].includes(type))
		return [true, () => {}];
	const pos = index2pos(selectedPiece);
	const whereCanMoveX = whereCanMove(move, squares, squares[selectedPiece], pos.x, pos.y, realMove);
	const moveIndex = whereCanMoveX.map(x => x[0]).indexOf(endIndex);
	const canMove = moveIndex !== -1;
	const doMoveExtra = (canMove ? whereCanMoveX[moveIndex] : [null, null])[1];
	if (window.debug1)
		console.adlog(2, 'can be moved test', { fromPos: pos, from: selectedPiece, to: endIndex, squares: squares, whereCanMove: whereCanMoveX, type: type, canMove: canMove });
	return [selectedPiece !== null && canMove, doMoveExtra];
}

const canBeMovedExtra = (...args) => {
	const [,from,,squares] = args;
	let result;
	result = squares[from] ? canBeMovedInternal(...args) : [null, null];
	return result;
}
const canBeMoved = (...args) => (canBeMovedExtra(...args) ?? [])[0];

function isKingAttacked(move, kingIndex, squares) {
	for (let i = 0; i < squares.length; i++)
		if (i !== kingIndex && squares[i] && squares[i].player !== squares[kingIndex].player && canBeMoved(move, i, kingIndex, squares))
			return true;
	return false;
}

const moveCanBePlayed = (move, from, to, squares, canMove, extra) => {
	if (canMove === undefined)
		[canMove, extra] = canBeMovedExtra(move, from, to, squares);
	if (typeof(extra) !== 'function')
		extra = () => {};
	if (!canMove)
		return false;
	let trySquares = clone(squares);
	console.adlog(4, 'moveCanBePlayed: trySquares log', trySquares);
	trySquares[from] = null;
	trySquares[to] = squares[from];
	const oldGameLogic = window._gameLogic; // save data before calling extra to restore them afterwards
	extra((i, v) => trySquares[i] = v);
	window._gameLogic = oldGameLogic;
	let king;
	for (let i = 0; i < trySquares.length; i++)
		if (trySquares[i] && trySquares[i].fullName === `${squares[from].player} king`) {
			king = i;
			break;
		}
	if (isKingAttacked(move, king, trySquares))
		return false;
	return true;
};

const checkMate = (move, player, squares) => {
	console.adlog(4, 'MateCheck started: squares:', squares);
	for (let i = 0; i < squares.length; i++) {
		console.adlog(4, 'checking square', index2pos(i), squares[i]);
		if (!squares[i] || squares[i].player !== player)
			continue;
		console.adlog(4, 'not skipping');
		for (const [pos, extra] of whereCanMove(move, squares, squares[i], index2pos(i).x, index2pos(i).y)) {
			console.adlog(4, 'checking move', index2pos(i), '->', index2pos(pos));
			if (moveCanBePlayed(move, i, pos, squares, true, extra))
				return false;
		}
	}
	let king;
	for (let i = 0; i < squares.length; i++)
		if (squares[i] && squares[i].fullName === `${player} king`) {
			king = i;
			break;
		}
	return isKingAttacked(move, king, squares) ? 'checkmate' : 'stalemate';
};

window.unbug1 = (p) => window.debug1 = p ?? true;

const _internal = { canBeMoved: canBeMovedInternal };

export { canBeMoved, canBeMovedExtra, whereCanMove, index2pos, pos2index, _internal as internal, isKingAttacked, moveCanBePlayed, checkMate };
