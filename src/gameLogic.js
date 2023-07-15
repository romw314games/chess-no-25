import { getLg } from './DebugRunContext';

const index2pos = (index) => { return { x: index % 8, y: Math.floor(index / 8) }; };
const pos2index = (x, y) => (y === undefined) ? pos2index(x.x, x.y) : (x + y * 8);

function getSquare(squares, x, y) {
	return squares[pos2index(x, y)];
}

function whereCanMove(squares, piece, x, y) {
	if (y === undefined) return whereCanMove(squares, x.x, x.y);

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
			console.dlog(getLg(), 4, `testing qm tempresult log 1 / whereCanMove`, { $tempPos: [tempX, tempY], $pos: [x, y], $result: result.map(index2pos).map(obj => [obj.x, obj.y]), result: result, dir: [dirX, dirY] });
			addIfEmptyExt(tempX, tempY, isValidPosition(tempX, tempY));
			console.dlog(getLg(), 3, `testing qm tempresult log 2 / whereCanMove`, { $pos: [x, y], $result: result.map(index2pos).map(obj => [obj.x, obj.y]), result: result, dir: [dirX, dirY] });
		}
	}

	global._gameLogic ??= {};
	global._gameLogic.whereCanMove ??= {
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
			addIfEmpty(x + 1, piece.utils.forward(y, 1), pawnCapture);
			addIfEmpty(x - 1, piece.utils.forward(y, 1), pawnCapture);
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
			], () => global._gameLogic.whereCanMove.castling[piece.player] = {});
			if (piece.player === 'light') {
				const canCastle = global._gameLogic.whereCanMove.castling.light;
				if (canCastle.kingside && !square(5, 7) && !square(6, 7))
					add(6, 7, setSquare => {
						setSquare(pos2index(5, 7), square(7, 7));
						setSquare(pos2index(7, 7), null);
					});
				if (canCastle.queenside && !square(3, 7) && !square(2, 7) && !square(1, 7))
					add(2, 7, setSquare => {
						setSquare(pos2index(3, 7), square(0, 7));
						setSquare(pos2index(0, 7), null);
					});
			}
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

	console.dlog(getLg(), 3, `whereCanMove: test end`, result);

	return result;
}

function canBeMovedInternal(selectedPiece, endIndex, squares) {
	if (endIndex === selectedPiece)
		return [false, null];
	const type = squares[selectedPiece].name;
	if (!['pawn', 'knight', 'king', 'rook', 'queen', 'bishop'].includes(type))
		return [true, () => {}];
	const pos = index2pos(selectedPiece);
	const whereCanMoveX = whereCanMove(squares, squares[selectedPiece], pos.x, pos.y);
	const moveIndex = whereCanMoveX.map(x => x[0]).indexOf(endIndex);
	const canMove = moveIndex !== -1;
	const doMoveExtra = (canMove ? whereCanMoveX[moveIndex] : [null, null])[1];
	if (global.debug1)
		console.adlog(2, 'can be moved test', { fromPos: pos, from: selectedPiece, to: endIndex, squares: squares, whereCanMove: whereCanMoveX, type: type, canMove: canMove });
	return [selectedPiece !== null && canMove, doMoveExtra];
}

const canBeMovedExtra = (from, to, squares) => {
	let result;
	result = squares[from] ? canBeMovedInternal(from, to, squares) : [null, null];
	return result;
}
const canBeMoved = (from, to, squares) => (canBeMovedExtra(from, to, squares) ?? [])[0];

global.unbug1 = (p) => global.debug1 = p ?? true;

const _internal = { canBeMoved: canBeMovedInternal };

export { canBeMoved, canBeMovedExtra, whereCanMove, index2pos, pos2index, _internal as internal };
