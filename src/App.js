import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageForm from './components/ImageForm/ImageForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/Facerecognition.jsx';
import SignIn from './components/SignIn/SignIn.jsx';
import Register from './components/Register/Register.jsx';
import 'tachyons';
import ParticlesBg from 'particles-bg';


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
  num: 500,
  color: '#EDEDF4',
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    };
  }

  // Handles the user profile
  loadUser = (data) => {
    this.setState({ user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  };

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

  // Handles the route change for the Sign In page
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false, route: 'signin' });
    } else if (route === 'home') {
      this.setState({ isSignedIn: true, route: route });
    } else {
      this.setState({ route: route });
    }
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg {...particlesParams} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === 'home'
          ? <div>
              <Logo />
              <Rank />
              <ImageForm />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
            route === 'signin'
            ? <SignIn onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;