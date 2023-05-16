import React from 'react';
import logo from './logo.svg';
import './App.css';
import Grid from './components/Grid';

function App() {

  const gridSettings = {
    
    width: 10,
    height: 10,
    bombDensity: 0.1
  }

  return (
    <div className="App">
        <Grid settings={gridSettings}/>
    </div>
  );
}

export default App;
