import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { createContext, useContext } from 'react';

const OnNavigateContext = createContext();


function NavButton({ to, href, children }) {
	const navigate = useContext(OnNavigateContext);
	return <Button color="inherit" onClick={to ? (() => navigate(to)) : (() => window.location.href = href)}>{children}</Button>;
}

function NavBar({ onNavigate, children }) {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="sticky">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Chess No. 25
					</Typography>
					<OnNavigateContext.Provider value={onNavigate}>
						{children}
					</OnNavigateContext.Provider>
				</Toolbar>
			</AppBar>
		</Box>
	);
}

function ChessNavBar({ onNavigate }) {
	return (
		<NavBar onNavigate={onNavigate}>
			<NavButton to="/">Home</NavButton>
			<NavButton to="/themes">Themes</NavButton>
			<NavButton to="/play">Play</NavButton>
			<NavButton href="https://github.com/romw314/chess-no-25">GitHub</NavButton>
		</NavBar>
	);
};

export default ChessNavBar;
