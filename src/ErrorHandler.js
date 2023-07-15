import { useState, useEffect, PureComponent } from 'react';
import { Alert, AlertTitle } from '@mui/material';

function ErrorHandler({ error, children }) {
	const reerror = useState(null)[1];
	error = global.error;
	useEffect(() => { setInterval(() => reerror(Math.random()), 100) });
	if (error) {
		const lines = error.message.split(/\r?\n/);
		const title = lines.shift();
		const body = lines.join('\n');
		return (
			<Alert severity="error">
				<AlertTitle>{title}</AlertTitle>
				{body}
			</Alert>
		);
	}
	return children;
}

function handleErrors(f) {
	try { f(); }
	catch (e) { global.error = e; }
}

export default ErrorHandler;
export { handleErrors };
