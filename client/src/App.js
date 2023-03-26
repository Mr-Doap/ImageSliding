import './App.css';
import React from 'react';
import { ConnectedImageSlide } from './components/ImageSlide';
import { Legend } from './components/Legend';

function App() {
  return (
    <div className='App'>
      <ConnectedImageSlide />
      <Legend />
    </div>
  );
}

export default App;
