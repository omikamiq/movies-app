import React from 'react';
import icon from './error_icon2.png';
import './error-component.css';

function ErrorComponent() {
  return (
    <div className='error-wrapper'>
      <img src={icon} alt='error_icon' />
      <div className='error-info'>
        Sorry, but seems like this content does not exist...
      </div>
    </div>
  );
}

export default ErrorComponent;
