import './Theme.css';
import themes from './themes.json';

function getImage(piece) {
	return piece ? <img className="square-value" src={piece.image} alt={piece.fullName} /> : piece;
}

function pieceIs(piece, color, name) {
	return piece && piece.color === color && piece.name === name;
}

function Theme(themeId) {
	const theme = themes.themes[themeId];
	this.name = theme.name;
	this.pieces = {
		light: {},
		dark: {}
	};
	this.getPiece = (isLight, name) => {
		let player = (isLight === true || isLight === 'light') ? 'light' : 'dark';
		return this.pieces[player][name];
	};
	this.game = theme.game ?? {
		style: {}
	};
	this.board = theme.board ?? {
		style: {},
	};
	this.square = theme.square ?? {
		lightColor: [ "transparent", "lightblue", "darkgray" ],
		darkColor: [ "lightgray", "darkred", "dimgray" ]
	}
	this.style = theme.style ?? {};

	// pieces
	try {
		for (let color of ['light', 'dark'])
			for (let piece of ['king', 'queen', 'bishop', 'knight', 'rook', 'pawn'])
				this.pieces[color][piece] = {
					image: require('./img/' + piece + '-' + themeId + '-' + color + '.png'),
					fullName: `${color} ${piece}`,
					theme: themeId,
					name: piece,
					player: color
				};
	}
	catch (e) {
		console.error(`couldn't find pieces for theme '${themeId}'`, `${e.name}: ${e.message}`);
	}
}

export { Theme, getImage, pieceIs };
