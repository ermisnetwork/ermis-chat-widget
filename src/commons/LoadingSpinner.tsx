import React from "react";

export interface IProps {
  primaryColor: string;
}

const LoadingSpinner = ({ primaryColor }: IProps) => {
  return (
    <div className="chatbox-spinner">
      <div className="lds-ring" style={{ color: primaryColor }}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
