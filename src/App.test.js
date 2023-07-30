import { render, screen } from '@testing-library/react';
import { DefaultApp as App } from './App';

test('renders title', () => {
	render(<App />);
	const title = screen.getByText('Chess No. 25');
	expect(title).toBeInTheDocument();
});

test('renders undo button', () => {
	render(<App />);
	const undoButton = screen.getByText('Chess No. 25');
	expect(undoButton).toBeInTheDocument();
});
