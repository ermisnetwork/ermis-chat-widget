import React from 'react';
export interface IProps {
    chatClient: any;
    channels: any[];
    senderId: string;
    channelCurrent: any;
    setChannelCurrent: (channel: any) => void;
    setError: (err: any) => void;
    allUsers: any[];
}
declare const ChannelList: ({ chatClient, channels, senderId, channelCurrent, setChannelCurrent, setError, allUsers, }: IProps) => React.JSX.Element;
export default ChannelList;
