
import React from 'react';

const SparkleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="none"></path>
    <path d="M12 17.998h.01"></path>
    <path d="M12 14.12V10.87"></path>
    <path d="m18.364 5.636-.001.001"></path>
    <path d="m5.636 5.636-.001.001"></path>
    <path d="m19.071 12.728-.001.001"></path>
    <path d="m4.929 12.728-.001.001"></path>
    <path d="M12 17.998h.01"></path>
    <path d="m18.364 18.364-.001.001"></path>
    <path d="m5.636 18.364-.001.001"></path>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export default SparkleIcon;
