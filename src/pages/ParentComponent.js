import React from 'react';
import DashboardUser from './DashboardUser';
import DashboardAdmin from './DashboardAdmin';

const ParentComponent = () => {
  const handleRequestSubmit = () => {
    // Your logic for submitting the request goes here
    console.log('Request submitted');
  };

  return (
    <div>
      <h1>Parent Component</h1>
      {/* 
        Pass handleRequestSubmit as a prop named onRequestSubmit to DashboardUser
        Ensure that handleRequestSubmit is a function
      */}
      <DashboardUser onRequestSubmit={handleRequestSubmit} />
    </div>
  );
};

export default ParentComponent;
