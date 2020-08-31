import React from 'react';
import logo from './logo.svg';
import { Provider, useDispatch } from 'react-redux'
import './App.css';
import configureStore from './store/store';
import Dashboard from './components/Dashboard/Dashboard';
import { ThemeProvider } from 'styled-components'
import { BrowserRouter as Router } from 'react-router-dom';

const theme = {
  spacing: 4,
  palette: {
    primary: '#048BA8',
    accent: '#F18F01'
  },
};


function App() {
  return (
		<Router>
      <Provider store={configureStore()}>
        <ThemeProvider theme={theme}>
          <Dashboard />
        </ThemeProvider>
      </Provider>
		</Router>
  );
}

export default App;
