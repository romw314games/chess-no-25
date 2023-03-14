import './Theme.css';

function getImage(piece) {
	return piece ? <img className="square-value" src={piece.image} alt={piece.fullName} /> : piece;
}

function pieceIs(piece, color, name) {
	return piece && piece.color === color && piece.name === name;
}

function Theme(themeName) {
	this.name = themeName;
	this.pieces = {
		light: {},
		dark: {}
	};
	this.getPiece = (isLight, name) => {
		let player = (isLight === true || isLight === 'light') ? 'light' : 'dark';
		return this.pieces[player][name];
	};
	this.game = {
		style: {}
	};
	
	try {
		// pieces
		for (let color of ['light', 'dark'])
			for (let piece of ['king', 'queen', 'bishop', 'knight', 'rook', 'pawn'])
				this.pieces[color][piece] = {
					image: require('./img/' + piece + '-' + themeName + '-' + color + '.png'),
					fullName: `${color} ${piece}`,
					theme: themeName,
					name: piece,
					player: color
				};
	}
	catch {
		console.log(`pieces for theme '${themeName}' not found`)
	}
	
	// background color
	switch (themeName) {
		case 'default': this.backgroundColor = 'transparent'; break;
		case 'dark': this.backgroundColor = 'dimgray'; break;
		default: this.backgroundColor = 'red'; break;
	}

	return this;
}

export { Theme, getImage, pieceIs };
