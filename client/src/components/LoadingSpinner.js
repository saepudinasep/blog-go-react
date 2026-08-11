import React from 'react';
import { Spinner } from 'react-bootstrap';

import { useLoading } from '../context/LoadingContext';

import './LoadingSpinner.css';

const LoadingSpinner = () => {
  const { loading } = useLoading();

  if (!loading) {
    return null;
  }

  return (
    <div className='global-loading'>
      <div className='loading-content'>
        <Spinner animation='border' role='status' className='loading-spinner' />

        <span>Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
