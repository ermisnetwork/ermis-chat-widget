import React, { useEffect } from "react";
import { IconClose } from "../constants";

export interface IProps {
  message: string;
  onClose: () => void;
}

const Notification = ({ message, onClose }: IProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [onClose, 3000]);

  return (
    <div className="notification">
      <p>{message}</p>
      <button onClick={onClose}>
        <IconClose width={20} height={20} color={"#721c24"} />
      </button>
    </div>
  );
};

export default Notification;
