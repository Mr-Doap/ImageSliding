import './ImageSlide.css';
import React, {useState, useEffect} from 'react';
import { IsRegionPresentInArray } from '../utils';
import axios from 'axios';
import { BASE_URL, DATA_POLL_INTERVAL_MS, ROWS, COLS} from '../consts';

export const ConnectedImageSlide = () => {
    const [captured, setCaptured] = useState(null);
    const [capturing, setCapturing] = useState(null);
    const [focused, setFocused] = useState(null);
    const [requested, setRequested] = useState(null);
  
    const fetchCaptured = () => {
      axios.get(`${BASE_URL}/captured`).then(res => setCaptured(res.data));
    };
  
    const fetchRequested = () => {
      axios.get(`${BASE_URL}/request`).then(res => setRequested(res?.data ?? []));
    };
  
    const fetchFocused = () => {
      axios.get(`${BASE_URL}/focused`).then(res => setFocused(res?.data ?? []));
    };
  
    const fetchAllData = () => {
      fetchCaptured();
      fetchRequested();
      fetchFocused();
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
  
    return (<ImageSlide capturedRegions={captured} capturingRegion={capturing} requestedRegions={requested} focusedRegions={focused} />);
  };
  
  const ImageSlide = (props) => {
    const {capturedRegions, capturingRegion, requestedRegions, focusedRegions} = props;
  
    if (!(capturedRegions && capturingRegion && requestedRegions && focusedRegions)) {
      return null;
    }
  
    const getClassName = (region) => {
      if (IsRegionPresentInArray(capturedRegions, region)) {
        return 'Captured';
      }
      else if (IsRegionPresentInArray(focusedRegions, region)) {
        return 'Focused';
      }
      else if (IsRegionPresentInArray(requestedRegions, region)) {
        return 'Requested';
      }
      else {
        return 'Default';
      }
    };
  
    let classNames = [];
  
    for(var x=1;x<=ROWS;x++) {
      for(var y=1;y<=COLS; y++) {
        var className = '';
        if (capturingRegion?.x === x && capturingRegion?.y === y) {
          className = 'Active ';
        }
        className += getClassName({x,y});
        classNames.push(className);
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