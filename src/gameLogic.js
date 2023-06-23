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
	const isValidPosition = (posX, posY) => {
		const range = [...Array(8).keys()];
		return range.includes(posX) && range.includes(posY);
	};
	const emptyForPlayer = (x, y) => !square(x, y) || (square(x, y).player !== piece.player);
	const addIfEmptyExt = (x, y, ext, isEmpty) => {
		isEmpty ??= emptyForPlayer;
		if (ext && isEmpty(x, y)) add(x, y);
	};
	const addIfEmpty = (x, y, isEmpty) => addIfEmptyExt(x, y, true, isEmpty);
	const addAllIfEmpty = (all) => {
		for (const [moveX, moveY] of all)
			addIfEmptyExt(moveX, moveY, isValidPosition(moveX, moveY));
	}
	const addAllIfEmptyRelative = (all) => addAllIfEmpty(all.map(pos => [pos[0] + x, pos[1] + y]));
	
	switch (piece.name) {
	}

	console.dlog(3, "whereCanMove: test end", result);

	return result;
}

function canBeMoved(selectedPiece, endIndex, squares) {
	if (endIndex === selectedPiece)
		return false;
	const type = squares[selectedPiece].name;
	if (![].includes(type))
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
