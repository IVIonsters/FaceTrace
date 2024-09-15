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


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
    }
  }

  onInputChange = (event) => {
    console.log(event.target.value);
  }

  onButtonSubmit = (event) => {
    console.log('click');
  }

  render() {
    return (
      <div className="App">
        <ParticlesBg {...particlesParams} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit} />
      </div>
    );
  }
}

export default App;
