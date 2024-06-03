import React, { useEffect, useState } from 'react';
import { getChannelName } from '../utils';
import ChannelAvatar from './ChannelAvatar';
import { ChatType, ERROR_MESSAGE } from '../constants';

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

const ChannelItem = ({
  chatClient,
  channel,
  senderId,
  channelCurrent,
  setChannelCurrent,
  setError,
  allUsers,
  allUnreadCount,
  fetchAllUnreadCount,
}: IProps) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // get unread count
    const listChannel = allUnreadCount?.channels || [];
    const unreadChannel = listChannel.find(
      (item2: any) => item2.channel_id === channel?.data.id
    );
    setCount(unreadChannel ? unreadChannel.unread_count : 0);
  }, [channel, allUnreadCount]);

  useEffect(() => {
    if (channel) {
      const handleWatchChannel = (event: any) => {
        if (
          event.channel_id === channel?.data.id &&
          event.channel_type === ChatType.Messaging
        ) {
          // setCount(event.unread_count);

          if (event.user.id !== senderId) {
            if (channelCurrent && channelCurrent.data.id === event.channel_id) {
              setTimeout(function () {
                onMarkReadChannel(channel);
                setCount(0);
              }, 300);
            } else {
              setTimeout(function () {
                fetchAllUnreadCount(senderId);
              }, 300);
            }
          }
        }
      };

      channel.on('message.new', handleWatchChannel);

      return () => {
        channel.off('message.new', handleWatchChannel);
      };
    }
  }, [channel, senderId, channelCurrent]);

  const onMarkReadChannel = async (channel: any) => {
    try {
      const response = await channel.markRead();
      if (response) {
        return response;
      }
    } catch (error: any) {
      setError(error.message || ERROR_MESSAGE);
    }
  };

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

        setTimeout(function () {
          fetchAllUnreadCount(senderId);
        }, 300);
      }
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGE);
    }
  };

  return (
    <div
      className={`chatbox-item ${
        channel.id === channelCurrent?.id ? 'active' : ''
      }`}
      onClick={() => onSelectChannel(channel)}
    >
      <div className="chatbox-item-avatar">
        <ChannelAvatar
          senderId={senderId}
          channel={channel}
          width={30}
          height={30}
          allUsers={allUsers}
        />
      </div>
      <div className="chatbox-item-cont">
        <span className="chatbox-item-name">
          {getChannelName(channel, senderId, allUsers)}
        </span>
        {count !== 0 && <span className="chatbox-item-count">{count}</span>}
      </div>
    </div>
  );
};

export default ChannelItem;
