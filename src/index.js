import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App, { setupData } from './App';
import { Theme } from './Theme';
import reportWebVitals from './reportWebVitals';

const data = new setupData(new Theme('default'));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App setupData={data} />
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
