import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
  return (
    <div className='ma4 mt0'>
      <Tilt>
        <div className='Tilt pa3' style={{ height: '150px', width: '150px' }}>
          <img style={{paddingTop: '5px'}} 
          alt='logo' 
          src={brain}/>
        </div>
      </Tilt>
    </div>
  );
}

export default Logo;


//https://icons8.com/icon/43137/brain