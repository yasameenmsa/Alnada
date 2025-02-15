import React from 'react';

const Spinner: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div className={`spinner ${className}`} {...props}>
      <div className="spinner-inner"></div>
    </div>
  );
};

export default Spinner;