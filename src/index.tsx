import './styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { StoreProvider } from 'easy-peasy';
import { store } from './store';
import { BrowserRouter } from "react-router-dom"
import { SnackbarProvider } from "notistack"
import { MuiThemeProvider } from '@material-ui/core';
import { muiTheme } from './styles/muiTheme';

ReactDOM.render(
	<React.StrictMode>
		<StoreProvider store={store}>
			<BrowserRouter>
				<MuiThemeProvider theme={muiTheme}>
					<SnackbarProvider
						anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
					>
						<App />
					</SnackbarProvider>
				</MuiThemeProvider>
			</BrowserRouter>
		</StoreProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
