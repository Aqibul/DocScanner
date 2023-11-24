import React, {createContext, useContext, useState} from 'react';

const ImageContext = createContext();

export const ImageProvider = ({children}) => {
  const [scannedImages, setScannedImages] = useState([]);
  const [latestScanId, setLatestScanId] = useState(null);

  const addScannedImage = newImage => {
    setScannedImages(prevImages => [...prevImages, newImage]);
    setLatestScanId(Date.now());
  };

  return (
    <ImageContext.Provider
      value={{scannedImages, addScannedImage, latestScanId}}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImage must be used within an ImageProvider');
  }
  return context;
};
