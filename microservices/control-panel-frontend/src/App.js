import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import configureStore from './store/store';
import NavigationContainer from './App/NavigationContainer';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { CircularProgress, CssBaseline } from '@material-ui/core';

const theme = createMuiTheme({
	palette: {
		primary: { main: '#048BA8' },
		secondary: { main: '#F18F01' },
		type: 'light',
	},
});
function App() {
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
