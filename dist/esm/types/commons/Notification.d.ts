import React from "react";
export interface IProps {
    message: string;
    onClose: () => void;
}
declare const Notification: ({ message, onClose }: IProps) => React.JSX.Element;
export default Notification;
