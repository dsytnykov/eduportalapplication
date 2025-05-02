import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loader = ({ size = "lg", text = "Loading..." }) => {
  let fontSize;
  
  switch (size) {
    case "sm":
      fontSize = "text-xl";
      break;
    case "md":
      fontSize = "text-2xl";
      break;
    case "lg":
      fontSize = "text-4xl";
      break;
    case "xl":
      fontSize = "text-6xl";
      break;
    default:
      fontSize = "text-4xl";
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <FontAwesomeIcon 
        icon={faSpinner} 
        className={`${fontSize} text-blue-600 animate-spin mb-2`} 
      />
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
};

export default Loader;
