import React, { Component } from 'react'
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageForm from './components/ImageForm/ImageForm';
import Rank from './components/Rank/Rank';
import 'tachyons';
import ParticlesBg from 'particles-bg'

const particlesParams = {
  className: 'particles',
  type: 'cobweb',
  bg: true,
  num: 700,
  color: '#ffffff',
}


function App() {
  return (
    <div className="App">
      <ParticlesBg {...particlesParams} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageForm />
    </div>
  );
}

export default App;
