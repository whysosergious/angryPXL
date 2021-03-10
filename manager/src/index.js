import React from 'react';
import ReactDOM from 'react-dom';
import './logic/methods.js'
import 'logic/cook.js';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { fetchJSON } from 'logic/zcm';

// fetchJSON('data.json').then(() => {
	ReactDOM.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
		document.getElementById('root')
	);
	
	reportWebVitals();
// });