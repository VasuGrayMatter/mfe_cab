import React from 'react';
import CabList from './components/CabList';
import CabSummary from './components/CabSummary';


// Export both components
export { CabSummary };
export default function CabApp() { 
  return (
    <div className="cab-app">
      <CabList/>
    </div>
  ); 
}