import styles from './Theme.module.css';
import themes from './themes.json';

function getImage(piece) {
	return piece ? <img className={styles.squareValue} src={piece.image} alt={piece.fullName} /> : piece;
}

function pieceIs(piece, color, name) {
	return piece && piece.color === color && piece.name === name;
}

function ThemeData(theme, options = {}) {
	if (!theme.name && options.validate)
		console.error(`theme not valid, info`, { theme: theme, this: this, options: options });
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
	if (options.findPieces ?? true) {
		try {
			for (let color of ['light', 'dark'])
				for (let piece of ['king', 'queen', 'bishop', 'knight', 'rook', 'pawn'])
					this.pieces[color][piece] = {
						image: require('./img/' + piece + '-' + theme.name + '-' + color + '.png'),
						fullName: `${color} ${piece}`,
						theme: theme.name,
						name: piece,
						player: color,
						colorVal: (l, d) => (color === 'light') ? l : d,
						utils: {
							forward: (y, d) => (color === 'light') ? (y - d) : (y + d)
						}
					};
		}
		catch (e) {
			console.error(`couldn't find pieces for theme '${theme.name}'\n${e.name}: ${e.message}`);
		}
	}
}

function Theme(themeId, logrun) {
	global.cdlog(logrun, 1, `theme info {${themeId}}`);
	if (!themes.themes[themeId])
		console.error(`couldn't find theme ${themeId}, info`, { themeId: themeId, global: global, _: [] });
	const theme = themes.themes[themeId];
	theme.name ??= themeId;
	const result = new ThemeData(theme);
	logrun(() => global.cdlog(logrun, 2, 'theme full', result));
	return result;
}

export { Theme, getImage, pieceIs };
export default ThemeData;
