import './ImageSlide.css';
import React, {useState, useEffect} from 'react';
import { IsRegionPresentInArray } from '../utils';
import axios from 'axios';
import { BASE_URL, DATA_POLL_INTERVAL_MS, ROWS, COLS, DEFAULT_ACTIVE_REGION} from '../consts';

export const ConnectedImageSlide = () => {
    const [captured, setCaptured] = useState(null);
    const [active, setActive] = useState(null);
    const [focused, setFocused] = useState(null);
    const [requested, setRequested] = useState(null);
    const [focusing, setFocusing] = useState(null);
  
    const fetchCaptured = () => {
      axios.get(`${BASE_URL}/captured`).then(res => setCaptured(res.data));
    };
  
    const fetchRequested = () => {
      axios.get(`${BASE_URL}/request`).then(res => setRequested(res?.data ?? []));
    };
  
    const fetchFocused = () => {
      axios.get(`${BASE_URL}/focused`).then(res => setFocused(res?.data ?? []));
    };

    const fetchFocusing = () => {
      axios.get(`${BASE_URL}/focusing`).then(res => setFocusing(res?.data));
    };
  
    const fetchAllData = () => {
      fetchCaptured();
      fetchRequested();
      fetchFocused();
      fetchFocusing();
    };
  
    const handleArrowUp = ({x,y}) => {
      if (x === 1) {
        return {x,y};
      }
      const newRegion = {x: x-1, y};
      axios.post(`${BASE_URL}/move`, newRegion);
      return newRegion;
    };

    const handleArrowDown = ({x,y}) => {
      if (x === ROWS) {
        return {x,y};
      }
      const newRegion = {x: x+1, y};
      axios.post(`${BASE_URL}/move`, newRegion);
      return newRegion;
    };

    const handleArrowLeft = ({x,y}) => {
      if (y === 1) {
        return {x,y};
      }
      const newRegion = {x, y: y-1};
      axios.post(`${BASE_URL}/move`, newRegion);
      return newRegion;
    };

    const handleArrowRight = ({x,y}) => {
      if (y === COLS) {
        return {x,y};
      }
      const newRegion = {x, y: y+1};
      axios.post(`${BASE_URL}/move`, newRegion);
      return newRegion;
    };

    const handleKeyDown = (event) => {
      if (event.code !== 'ArrowUp' && event.code !== 'ArrowDown' && event.code !== 'ArrowLeft' && event.code !== 'ArrowRight') {
        return;
      }
      event.preventDefault();
      if (event.code === 'ArrowUp') {
        setActive(handleArrowUp);
      }
      else if (event.code === 'ArrowDown') {
        setActive(handleArrowDown);
      }
      else if (event.code === 'ArrowLeft') {
        setActive(handleArrowLeft);
      }
      else if (event.code === 'ArrowRight') {
        setActive(handleArrowRight);
      }
    };
  
    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
  
    useEffect(() => {
      fetchAllData();
    }, []);
  
    useEffect(() => {
      const getPreviousActiveRegion = () => {
        if (focusing) {
          return focusing;
        }
        else if (captured && captured.length > 0) {
          return captured[captured.length - 1];
        }
  
        return null;
      };

      if (!active) {
        const region = getPreviousActiveRegion();
        if (region) {
          setActive(region);
        }
        else {
          setActive(DEFAULT_ACTIVE_REGION);
          axios.post(`${BASE_URL}/move`, DEFAULT_ACTIVE_REGION);
        }
      }
    }, [active, setActive, captured, focusing]);
  
    // Short polling used to simulate real time updates in the UI.
    useEffect(() => {
      const intervalId = setInterval(fetchAllData, DATA_POLL_INTERVAL_MS);
      return () => clearInterval(intervalId);
    }, []);
  
    return (<ImageSlide capturedRegions={captured} activeRegion={active} requestedRegions={requested} focusedRegions={focused} focusingRegion={focusing} />);
  };
  
  const ImageSlide = (props) => {
    const {capturedRegions, activeRegion, requestedRegions, focusedRegions, focusingRegion} = props;
  
    if (!(capturedRegions && activeRegion && requestedRegions && focusedRegions)) {
      return null;
    }
  
    const getClassName = (region) => {
      if (IsRegionPresentInArray(capturedRegions, region)) {
        return 'Captured';
      }
      else if (IsRegionPresentInArray(focusedRegions, region)) {
        return 'Focused';
      }
      else if (focusingRegion?.x === region?.x && focusingRegion?.y === region?.y) {
        return 'Focusing';
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
        if (activeRegion?.x === x && activeRegion?.y === y) {
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