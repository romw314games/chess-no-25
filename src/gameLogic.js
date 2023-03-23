const index2pos = (index) => { return { x: index % 8, y: Math.floor(index / 8) }; };
const pos2index = (x, y) => (y === undefined) ? pos2index(x.x, x.y) : (x + y * 8);

function getSquare(squares, x, y) {
	return squares[pos2index(x, y)];
}

function whereCanMove(squares, piece, x, y) {
	if (y === undefined) return whereCanMove(squares, x.x, x.y);

	const result = [];

	const square = (x, y) => getSquare(squares, x, y);
	const add = (x, y) => result.push(pos2index(x, y));
	const emptyForPlayer = (x, y) => !square(x, y) || (square(x, y).player !== piece.player);
	const addIfEmptyExt = (x, y, ext, isEmpty) => {
		isEmpty ??= emptyForPlayer;
		if (ext && isEmpty(x, y)) add(x, y);
	};
	const addIfEmpty = (x, y, isEmpty) => addIfEmptyExt(x, y, true, isEmpty);
	const addAllIfEmpty = (all) => {
		for (let [x, y] of all)
			addIfEmptyExt(x, y, isValidPosition(x, y));
	}
	const addAllIfEmptyRelative = (all) => addAllIfEmpty(all.map(pos => [pos[0] + x, pos[1] + y]));
	const isValidPosition = (x, y) => {
		const range = [...Array(8).keys()];
		return range.includes(x) && range.includes(y);
	};
	const pawnCapture = (x, y) => emptyForPlayer(x, y) && square(x, y);
	const rookOrBishopMovement = (dirs) => {
		for (let [dirX, dirY] of dirs) {
			let tempX, tempY, count = 0;
			for ([tempX, tempY] = [x, y]; isValidPosition(tempX, tempY) && ((square(tempX, tempY) === null) || !count); [tempX, tempY, count] = [tempX + dirX, tempY + dirY, count + 1])
				add(tempX, tempY);
			console.dlog(4, `testing qm tempresult log 1 / whereCanMove`, { $tempPos: [tempX, tempY], $pos: [x, y], $result: result.map(index2pos).map(obj => [obj.x, obj.y]), result: result, dir: [dirX, dirY] });
			addIfEmptyExt(tempX, tempY, isValidPosition(tempX, tempY));
			console.dlog(3, `testing qm tempresult log 2 / whereCanMove`, { $pos: [x, y], $result: result.map(index2pos).map(obj => [obj.x, obj.y]), result: result, dir: [dirX, dirY] });
		}
	}
	
	switch (piece.name) {
		case 'pawn':
			addIfEmpty(x, piece.utils.forward(y, 1), (x, y) => !square(x, y));
			addIfEmptyExt(x, piece.utils.forward(y, 2), y === piece.colorVal(6, 1) && (square(x, piece.utils.forward(y, 1)) === null), (x, y) => !square(x, y));
			addIfEmpty(x + 1, piece.utils.forward(y, 1), pawnCapture);
			addIfEmpty(x - 1, piece.utils.forward(y, 1), pawnCapture);
			break;
		case 'rook':
			rookOrBishopMovement([[1, 0], [0, 1], [-1, 0], [0, -1]]);
			break;
		case 'bishop':
			rookOrBishopMovement([[1, 1], [-1, 1], [-1, -1], [1, -1]]);
			break;
	}

	console.dlog(3, `whereCanMove: test end`, result);

	return result;
}

function canBeMoved(selectedPiece, endIndex, squares) {
	if (endIndex === selectedPiece)
		return false;
	const type = squares[selectedPiece].name;
	if (!['pawn', 'rook', 'bishop'].includes(type))
		return true;
	const pos = index2pos(selectedPiece);
	const whereCanMoveX = whereCanMove(squares, squares[selectedPiece], pos.x, pos.y);
	const canMove = whereCanMoveX.includes(endIndex);
	if (global.debug1)
		console.dlog(2, 'can be moved test', { fromPos: pos, from: selectedPiece, to: endIndex, squares: squares, whereCanMove: whereCanMoveX, type: type, canMove: canMove });
	return selectedPiece !== null && canMove;
}

global.unbug1 = (p) => global.debug1 = p ?? true;

export { canBeMoved, whereCanMove, index2pos, pos2index };
