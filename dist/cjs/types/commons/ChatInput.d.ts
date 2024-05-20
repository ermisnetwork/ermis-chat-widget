import React from "react";
export interface IProps {
    primaryColor: string;
    senderId: string;
    channelCurrent: any;
    setError: (err: any) => void;
}
declare const ChatInput: ({ primaryColor, senderId, channelCurrent, setError, }: IProps) => React.JSX.Element;
export default ChatInput;
