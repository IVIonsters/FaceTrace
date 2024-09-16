import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageForm from './components/ImageForm/ImageForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/Facerecognition.jsx';
import SignIn from './components/SignIn/SignIn.jsx';
import 'tachyons';
import ParticlesBg from 'particles-bg';
import Sign from './components/SignIn/SignIn.jsx';

// Specify the correct user_id/app_id pairings
const USER_ID = 'clarifai';
const APP_ID = 'main';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

// Clarifai API request options
const getRequestOptions = (imageUrl) => ({
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Key ' + process.env.REACT_APP_CLARIFAI_PAT
  },
  body: JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": imageUrl
          }
        }
      }
    ]
  })
});

// Params for particles-bg
const particlesParams = {
  className: 'particles',
  type: 'cobweb',
  bg: true,
  num: 700,
  color: '#ffffff',
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
    };
  }

  // Handles input on Image form - url
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  // Calculate the bounding box
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  };

  // Display the bounding box
  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  // handles the "detect" button on ImageForm
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", getRequestOptions(this.state.input))
      .then(response => response.json())
      .then(result => {
        if (result) {
          this.displayFaceBox(this.calculateFaceLocation(result));
        }
      })
      .catch(error => console.log('error', error));
  };

  render() {
    return (
      <div className="App">
        <ParticlesBg {...particlesParams} />
        <Navigation />
        { this.state.route === 'signin' 
        ? <SignIn />
        : <div>
            <Logo />
            <Rank />
            <ImageForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
          </div>
        }
      </div>
    );
  }
}

export default App;