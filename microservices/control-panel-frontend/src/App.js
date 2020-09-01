import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import configureStore from './store/store';
import Dashboard from './components/Dashboard/Dashboard';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';

const theme = {
	spacing: 4,
	palette: {
		primary: '#048BA8',
		accent: '#F18F01',
	},
};

function App() {
	return (
		<Router>
			<Suspense fallback={<CircularProgress />}>
				<Provider store={configureStore()}>
					<ThemeProvider theme={theme}>
						<Dashboard />
					</ThemeProvider>
				</Provider>
			</Suspense>
		</Router>
	);
}

export default App;
