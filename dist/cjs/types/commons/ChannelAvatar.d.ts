import React from "react";
export interface IProps {
    senderId: string;
    channel: any;
    width: number;
    height: number;
}
declare const ChannelAvatar: ({ senderId, channel, width, height }: IProps) => React.JSX.Element;
export default ChannelAvatar;
