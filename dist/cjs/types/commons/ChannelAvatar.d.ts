import React from 'react';
export interface IProps {
    senderId: string;
    channel: any;
    width: number;
    height: number;
    allUsers: any[];
}
declare const ChannelAvatar: ({ senderId, channel, width, height, allUsers, }: IProps) => React.JSX.Element;
export default ChannelAvatar;
