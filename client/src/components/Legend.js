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
          <div className='Active'></div>
        </div>
        <div className='LegendText'>Active</div>
        <div className='LegendIcon'>
          <div className='Focusing'></div>
        </div>
        <div className='LegendText'>Focusing</div>
        <div className='LegendIcon'>
          <div className='Focused'></div>
        </div>
        <div className='LegendText'>Focused</div>
        <div className='LegendIcon'>
          <div className='Requested'></div>
        </div>
        <div className='LegendText'>Requested</div>
      </div>
    );
  };