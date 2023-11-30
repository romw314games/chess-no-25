import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App, { setupData } from './App';
import { Theme } from './Theme';
import { DebugRunProvider, getLg, setLg } from './DebugRunContext';
import ErrorHandler from './ErrorHandler';
import './debug';
import reportWebVitals from './reportWebVitals';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	console.log(`Welcome to Chess No. 25 debugger console!
@
	You can change log level by calling the loglevel function. The default log level is 2.`);
	global.uselog = 2;
}

setLg(f => f());

global.error = null;
global.catch = (error) => global.error = error;

const theme = new URLSearchParams(window.location.search).get('theme');
console.adlog(1, 'theme:', theme);
const data = new setupData(Theme(theme || 'dark', getLg));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<ErrorHandler error={global.error}>
			<DebugRunProvider>
				<App setupData={data} />
			</DebugRunProvider>
		</ErrorHandler>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
