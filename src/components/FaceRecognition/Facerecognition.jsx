import React from 'react';

const FaceRecognition = () => {
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputimage' alt='' src={'https://samples.clarifai.com/metro-north.jpg'} width='500px' height='auto'/>
      </div>
    </div>
  );
}

export default FaceRecognition;