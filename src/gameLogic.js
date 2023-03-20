function canBeMoved(selectedPiece, endIndex, squares) {
	if (endIndex === selectedPiece)
		return false;
	return selectedPiece !== null;
}

export { canBeMoved };
