import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import configureStore from './store/store';
import NavigationContainer from './App/NavigationContainer';
import { BrowserRouter as Router } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { MuiCtxProvider } from './components/hooks/muiState';
import { Auth0Provider } from '@auth0/auth0-react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

function App() {
	return (
		<Router>
			<Suspense fallback={<CircularProgress />}>
				<Auth0Provider
					domain="iot-sol.eu.auth0.com"
					clientId="YDdtHIKM025Us5WAExTGvtfX3ElM5His"
					redirectUri={window.location.origin}
					audience="https://iot-sol.eu.auth0.com/api/v2/"
					scope="read:current_user"
				>
					<MuiCtxProvider>
						<Provider store={configureStore()}>
							<DndProvider backend={HTML5Backend}>
								<NavigationContainer />
							</DndProvider>
						</Provider>
					</MuiCtxProvider>
				</Auth0Provider>
			</Suspense>
		</Router>
	);
}

export default App;
