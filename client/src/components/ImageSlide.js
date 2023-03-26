import './ImageSlide.css';
import React, {useState, useEffect} from 'react';
import { IsRegionPresentInArray } from '../utils';
import axios from 'axios';
import { BASE_URL, DATA_POLL_INTERVAL_MS, ROWS, COLS} from '../consts';

export const ConnectedImageSlide = () => {
    const [captured, setCaptured] = useState(null);
    const [capturing, setCapturing] = useState(null);
    const [focusedButNotCaptured, setFocusedButNotCaptured] = useState(null);
    const [requestedButNotFocused, setRequestedButNotFocused] = useState(null);
  
    const fetchCaptured = () => {
      axios.get(`${BASE_URL}/captured`).then(res => setCaptured(res.data));
    };
  
    const fetchRequestedButNotFocused = () => {
      axios.get(`${BASE_URL}/request`).then(res => setRequestedButNotFocused(res?.data ?? []));
    };
  
    const fetchFocusedButNotcaptured = () => {
      axios.get(`${BASE_URL}/request?focus=true`).then(res => setFocusedButNotCaptured(res?.data ?? []));
    };
  
    const fetchAllData = () => {
      fetchCaptured();
      fetchRequestedButNotFocused();
      fetchFocusedButNotcaptured();
    };
  
    const handleKeyDown = (event) => {
      if (event.code === 'ArrowUp') {
        event.preventDefault();
        setCapturing(({x,y}) => {
          if (x === 1) {
            return {x,y};
          }
          const newRegion = {x: x-1, y};
          axios.post(`${BASE_URL}/move`, newRegion);
          return newRegion;
        });
      }
      else if (event.code === 'ArrowDown') {
        event.preventDefault();
        setCapturing(({x,y}) => {
          if (x === ROWS) {
            return {x,y};
          }
          const newRegion = {x: x+1, y};
          axios.post(`${BASE_URL}/move`, newRegion);
          return newRegion;
        });
      }
      else if (event.code === 'ArrowLeft') {
        event.preventDefault();
        setCapturing(({x,y}) => {
          if (y === 1) {
            return {x,y};
          }
          const newRegion = {x, y: y-1};
          axios.post(`${BASE_URL}/move`, newRegion);
          return newRegion;
        });
      }
      else if (event.code === 'ArrowRight') {
        event.preventDefault();
        setCapturing(({x,y}) => {
          if (y === COLS) {
            return {x,y};
          }
          const newRegion = {x, y: y+1};
          axios.post(`${BASE_URL}/move`, newRegion);
          return newRegion;
        });
      }
      else{
        return;
      }
    };
  
    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
    }, []);
  
    useEffect(() => {
      fetchAllData();
    }, []);
  
    useEffect(() => {
      if (!capturing && captured) {
        if(captured.length > 0) {
          setCapturing(captured[captured.length - 1]);
        }
        else {
          setCapturing({x: ROWS/2, y: COLS/2});
          axios.post(`${BASE_URL}/move`, {x: ROWS/2, y: COLS/2});
        }
      }
    }, [capturing, setCapturing, captured]);
  
    useEffect(() => {
      const intervalId = setInterval(fetchAllData, DATA_POLL_INTERVAL_MS);
      return () => clearInterval(intervalId);
    }, []);
  
    return (<ImageSlide capturedRegions={captured} capturingRegion={capturing} requestedButNotFocusedRegions={requestedButNotFocused} focusedButNotCapturedRegions={focusedButNotCaptured} />);
  };
  
  const ImageSlide = (props) => {
    const {capturedRegions, capturingRegion, requestedButNotFocusedRegions, focusedButNotCapturedRegions} = props;
  
    if (!(capturedRegions && capturingRegion && requestedButNotFocusedRegions && focusedButNotCapturedRegions)) {
      return null;
    }
  
    const getClassName = (region) => {
      if (IsRegionPresentInArray(capturedRegions, region)) {
        return 'Captured';
      }
      else if (capturingRegion?.x === region.x && capturingRegion?.y === region.y) {
        return 'Capturing';
      }
      else if (IsRegionPresentInArray(focusedButNotCapturedRegions, region)) {
        return 'FocusedButNotCaptured';
      }
      else if (IsRegionPresentInArray(requestedButNotFocusedRegions, region)) {
        return 'RequestedButNotFocused';
      }
      else {
        return 'Default';
      }
    };
  
    let classNames = [];
  
    for(var x=1;x<=ROWS;x++) {
      for(var y=1;y<=COLS; y++) {
        classNames.push(getClassName({x,y}));
      }
    }
  
    return (
      <div className='ImageSlide'>
        {classNames.map((className, index) => {
          return (
            <div className={className} key={index}>
            </div>
          );
        })}    
      </div>
    );
  };