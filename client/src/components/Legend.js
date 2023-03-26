import './Legend.css';
import './ImageSlide.css';
import React from 'react';

export const Legend = () => {
    return (
      <div className='Legend'>
        <div className='LegendIcon'>
          <div className='Captured'></div>
        </div>
        <div className='LegendText'>Captured</div>
        <div className='LegendIcon'>
          <div className='Capturing'></div>
        </div>
        <div className='LegendText'>Capturing</div>
        <div className='LegendIcon'>
          <div className='FocusedButNotCaptured'></div>
        </div>
        <div className='LegendText'>Focused but not Captured</div>
        <div className='LegendIcon'>
          <div className='RequestedButNotFocused'></div>
        </div>
        <div className='LegendText'>Requested but not Focused</div>
      </div>
    );
  };