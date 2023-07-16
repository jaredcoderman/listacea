import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className='loading-spinner'>
      <style jsx>
      {`
      .loading-spinner {
        width: 35px;
        height: 35px;
        border:2px solid #f3f3f3;
        border-top: 4px solid black;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
        margin-top: 1rem;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      `}
      </style>
    </div>
  )
}

export default LoadingSpinner