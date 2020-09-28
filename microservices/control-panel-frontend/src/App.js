import React, { Suspense, useContext } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import configureStore from './store/store';
import NavigationContainer from './App/NavigationContainer';
import { BrowserRouter as Router } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { MuiCtxProvider } from './components/hooks/muiState';

function App() {
	return (
		<Router>
			<Suspense fallback={<CircularProgress />}>
				<MuiCtxProvider>
					<Provider store={configureStore()}>
						<NavigationContainer />
					</Provider>
				</MuiCtxProvider>
			</Suspense>
		</Router>
	);
}

export default App;
