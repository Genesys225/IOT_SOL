import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Connector } from 'mqtt-react';
import MessageList from './MessageList'


  function App() {
    
      fetch('/getSensors').then(console.log)
      
    
    return (
      <Connector mqttProps="localhost:8083">
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
              >/
              Learn TO!!!!XXXX444
            </a>
            <MessageList />
          </header>
        </div>
      </Connector>
  );
}

export default App;
