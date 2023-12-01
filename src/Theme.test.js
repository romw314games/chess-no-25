import { render, screen } from '@testing-library/react';
import ThemeData from './Theme';
import './debug';

describe('ThemeData', () => {
	test('creates truthy object', () => {
		const theme = new ThemeData({}, { validate: false, findPieces: false });
		expect(Boolean(theme)).toStrictEqual(true);
	});

	test('extracts name', () => {
		const count = 1000;
		for (let i = 0; i < count; i++) {
			const themeName = (Math.random() + 1).toString(36).substring(2);
			const theme = new ThemeData({ name: themeName }, { findPieces: false });
			expect(theme.name).toBe(themeName);
		}
	});

	test('extracts square colors', () => {
		const squareColorsToTest = [
			{
				lightColor: [ "transparent", "lightblue", "darkgray" ],
				darkColor: [ "lightgray", "darkred", "dimgray" ]
			},
			{
				lightColor: ['#cc6991', '#186f38', '#01d8e5'],
				darkColor: ['#1d0e1b', '#5b46dd', '#6feb13']
			}
		];
		for (const colors of squareColorsToTest) {
			const theme = new ThemeData({ square: colors }, { validate: false, findPieces: false });
			expect(theme.square).toStrictEqual(colors);
		}
		expect(new ThemeData({}, { validate: false, findPieces: false }).square).toStrictEqual(squareColorsToTest[0]);
	});
});
