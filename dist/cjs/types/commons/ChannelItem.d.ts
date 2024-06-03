import React from 'react';
export interface IProps {
    chatClient: any;
    channel: any;
    senderId: string;
    channelCurrent: any;
    setChannelCurrent: (channel: any) => void;
    setError: (err: any) => void;
    allUsers: any[];
    allUnreadCount: any;
    fetchAllUnreadCount: (senderId: string) => void;
}
declare const ChannelItem: ({ chatClient, channel, senderId, channelCurrent, setChannelCurrent, setError, allUsers, allUnreadCount, fetchAllUnreadCount, }: IProps) => React.JSX.Element;
export default ChannelItem;
