import React from "react";
export interface IProps {
    senderId: string;
    channelCurrent: any;
    primaryColor: string;
    setError: (err: any) => void;
}
declare const ChatTimeline: ({ senderId, channelCurrent, primaryColor, setError, }: IProps) => React.JSX.Element;
export default ChatTimeline;
