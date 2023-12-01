import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App, { setupData } from './App';
import Home, { HomePage, ThemesPage } from './Home';
import { Theme } from './Theme';
import { DebugRunProvider, getLg, setLg } from './DebugRunContext';
import ErrorHandler from './ErrorHandler';
import './debug';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	console.log(`Welcome to Chess No. 25 debugger console!
@
	You can change log level by calling the loglevel function. The default log level is 2.`);
	global.uselog = 2;
}

setLg(f => f());

global.error = null;
global.catch = (error) => global.error = error;

function ThemedApp() {
	const [params] = useSearchParams();
	return <App setupData={new setupData(Theme(params.get('theme') || 'dark', getLg))} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />}>
					<Route index element={<HomePage />} />
					<Route path="themes" element={<ThemesPage />} />
				</Route>
				<Route path="/play/" element={
					<ErrorHandler error={global.error}>
						<DebugRunProvider>
							<ThemedApp />
						</DebugRunProvider>
					</ErrorHandler>
				} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
