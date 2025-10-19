import React from 'react';

const SyncIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M1 4v6h6"></path>
    <path d="M23 20v-6h-6"></path>
    <path d="M20.49 9A9 9 0 0 0 7.54 4.54l-3 3"></path>
    <path d="M3.51 15a9 9 0 0 0 12.95 4.46l3-3"></path>
  </svg>
);

export default SyncIcon;