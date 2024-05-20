import React from "react";
import { getChannelName } from "../utils";
import ChannelAvatar from "./ChannelAvatar";
import { ERROR_MESSAGE } from "../constants";

export interface IProps {
  chatClient: any;
  channels: any[];
  senderId: string;
  channelCurrent: any;
  setChannelCurrent: (channel: any) => void;
  setError: (err: any) => void;
}

const ChannelList = ({
  chatClient,
  channels,
  senderId,
  channelCurrent,
  setChannelCurrent,
  setError,
}: IProps) => {
  const onSelectChannel = async (channel: any) => {
    try {
      const chanelId = channel.data.id;
      const channelType = channel.data.type;
      const channelSelected = chatClient.channel(channelType, chanelId);
      const response = await channel.query({
        messages: { limit: 50 },
      });

      if (response) {
        setChannelCurrent(channelSelected);
      }
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGE);
    }
  };

  return (
    <div className="chatbox-list">
      {channels.map((channel: any) => {
        return (
          <div className="chatbox-list-col" key={channel.id}>
            <div
              className={`chatbox-item ${
                channel.id === channelCurrent?.id ? "active" : ""
              }`}
              onClick={() => onSelectChannel(channel)}
            >
              <div className="chatbox-item-avatar">
                <ChannelAvatar
                  senderId={senderId}
                  channel={channel}
                  width={30}
                  height={30}
                />
              </div>
              <div className="chatbox-item-cont">
                <span>{getChannelName(channel, senderId)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChannelList;
