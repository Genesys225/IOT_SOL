import React, { Suspense, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import configureStore from './store/store';
import Dashboard from './components/Dashboard/Dashboard';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { CircularProgress, CssBaseline } from '@material-ui/core';

function App() {
	const theme = createMuiTheme({
		spacing: 4,
		palette: {
			primary: { main: '#048BA8' },
			secondary: { main: '#F18F01' },
			type: 'dark',
		},
	});

	return (
		<Router>
			<Suspense fallback={<CircularProgress />}>
				<Provider store={configureStore()}>
					<ThemeProvider theme={theme}>
						<CssBaseline />

						<Dashboard />
					</ThemeProvider>
				</Provider>
			</Suspense>
		</Router>
	);
}

export default App;
