import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageForm from './components/ImageForm/ImageForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/Facerecognition.jsx'
import 'tachyons';
import ParticlesBg from 'particles-bg';

// Clarifai API request options
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'clarifai';
const APP_ID = 'main';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
let IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';

// Clarifai API request options
const raw = JSON.stringify({
  "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
  },
  "inputs": [
      {
          "data": {
              "image": {
                  "url": IMAGE_URL
                  // "base64": IMAGE_BYTES_STRING
              }
          }
      }
  ]
});

const requestOptions = {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + process.env.REACT_APP_CLARIFAI_PAT
  },
  body: raw
};

// Params for particles-bg
const particlesParams = {
  className: 'particles',
  type: 'cobweb',
  bg: true,
  num: 700,
  color: '#ffffff',
};

class App extends Component {
  // constructor for the state
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
    };
  }

// Calculate the face location 
calculateFacelocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  console.log(width, height);
}

// Handles input on Image form - url
onInputChange = (event) => {
  console.log(event.target.value);
  this.setState({ input: event.target.value });
};

// handles the "detect" button on ImageForm
onButtonSubmit = (event) => {
  this.setState({ imageUrl: this.state.input });
  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(result => {
      const regions = result.outputs?.[0]?.data?.regions;

      if (regions) {
        regions.forEach(region => {
          // Accessing and rounding the bounding box values
          const boundingBox = region.region_info.bounding_box;
          const topRow = boundingBox.top_row.toFixed(3);
          const leftCol = boundingBox.left_col.toFixed(3);
          const bottomRow = boundingBox.bottom_row.toFixed(3);
          const rightCol = boundingBox.right_col.toFixed(3);

          region.data.concepts.forEach(concept => {
            // Accessing and rounding the concept value
            const name = concept.name;
            const value = concept.value.toFixed(4);

            console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
            // add the bounding box to the state
            this.calculateFacelocation(result);
          });
        });
      } else {
        console.log('No regions found in the response.');
      }
    })
    .catch(error => console.log('error', error));
};

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
      <FaceRecognition imageUrl={this.state.imageUrl} />
    </div>
  );
}
}

export default App;