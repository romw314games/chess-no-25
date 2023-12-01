import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import styles from './Home.module.css';
import NavBar from './NavBar';
import themes from './themes.json';

function Home() {
	const navigate = useNavigate();
	window.document.body.style.backgroundColor = 'transparent';
	window.document.body.style.color = 'black';
	return (
		<>
			<NavBar onNavigate={navigate}/>
			<div className={styles.home}>
				<Outlet />
			</div>
		</>
	);
}

function HomePage() {
	return (
		<>
			<p>Chess No. 25 is a simple and open source chess game for two players.</p>
			<p>Chess No. 25 has multiple themes available. <NavLink to="/themes">Try them now!</NavLink></p>
			<p>If you found a bug or have an idea, please <a href="https://github.com/romw314/chess-no-25/issues/new/choose">report it on GitHub</a>.</p>
		</>
	);
}

function ThemesPage() {
	let themelist = [];
	for (const theme in themes.themes)
		themelist.push(<li><NavLink to={`/play/?theme=${theme}`}>{themes.themes[theme].fullName || theme}</NavLink></li>);
	return (
		<>
			<p>Please choose a theme:</p>
			<ul>{themelist}</ul>
		</>
	);
}

export { HomePage, ThemesPage };
export default Home;
