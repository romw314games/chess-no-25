import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefaultApp } from './App';
import './debug';

describe('DefaultApp', () => {
	test('contains app div', () => {
		render(<DefaultApp />);
		const appDiv = screen.getByTestId('app-div');
		expect(appDiv).toBeInTheDocument();
		expect(appDiv).toHaveClass('App');
		expect(appDiv).not.toBeEmptyDOMElement();
	});
});

describe('App', () => {
	test('renders title', () => {
		render(<DefaultApp />);
		const title = screen.getByText('Chess No. 25');
		expect(title).toBeInTheDocument();
	});

	test('renders undo button', () => {
		render(<DefaultApp />);
		const undoButton = screen.getByText('Undo');
		expect(undoButton).toBeInTheDocument();
	});

	test('undo button is disabled at beginning', () => {
		render(<DefaultApp />);
		const undoButton = screen.getByText('Undo');
		expect(undoButton).toBeDisabled();
	});

	test('move works', () => {
		global.sqValue = '(value ?? {}).fullName';
		render(<DefaultApp />);
		const undoButton = screen.getByText('Undo');
		const start = screen.getByTestId('0/6');
		const end = screen.getByTestId('0/4');
		expect(start).toHaveTextContent(/^light pawn$/);
		expect(end).toBeEmptyDOMElement();
		userEvent.click(start);
		userEvent.click(end);
		expect(start).toBeEmptyDOMElement();
		expect(end).toHaveTextContent(/^light pawn$/);
	});

	test('undo button is enabled after move', () => {
		render(<DefaultApp />);
		const undoButton = screen.getByText('Undo');
		const start = screen.getByTestId('0/6');
		const end = screen.getByTestId('0/4');
		userEvent.click(start);
		userEvent.click(end);
		expect(undoButton).toBeEnabled();
	});
});
