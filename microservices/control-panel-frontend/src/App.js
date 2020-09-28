import React, { Suspense, useContext } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import configureStore from './store/store';
import NavigationContainer from './App/NavigationContainer';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { CircularProgress, CssBaseline } from '@material-ui/core';
import { MuiCtx } from './components/hooks/muiState';

function App() {
	const { theme } = useContext(MuiCtx);
	return (
		<Router>
			<Suspense fallback={<CircularProgress />}>
				<Provider store={configureStore()}>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<NavigationContainer />
					</ThemeProvider>
				</Provider>
			</Suspense>
		</Router>
	);
}

export default App;
