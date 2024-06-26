import React, { useEffect, useState } from 'react';
import { getChannelName } from '../utils';
import ChannelAvatar from './ChannelAvatar';
import { ChatType, DELAY_TIME_UNREAD_COUNT, ERROR_MESSAGE } from '../constants';

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
  const [timer, setTimer] = useState<any>(null);

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
      if (channelCurrent && channelCurrent.id === channel.data.id) {
        setCount(0);
      }

      const markRead = () => {
        onMarkReadChannel(channel);
        setCount(0);
        setTimer(null);
      };

      const handleWatchChannel = (event: any) => {
        if (
          event.channel_id === channel.data.id &&
          event.channel_type === ChatType.Messaging
        ) {
          setCount(event.unread_count);
          if (event.user.id !== senderId) {
            if (channelCurrent && channelCurrent.id === event.channel_id) {
              if (timer) {
                clearTimeout(timer);
              }
              setTimer(setTimeout(markRead, DELAY_TIME_UNREAD_COUNT));
            } else {
              if (timer) {
                clearTimeout(timer);
              }
              setTimer(
                setTimeout(function () {
                  fetchAllUnreadCount(senderId);
                }, DELAY_TIME_UNREAD_COUNT)
              );
            }
          }
        }
      };

      channel.on('message.new', handleWatchChannel);

      return () => {
        channel.off('message.new', handleWatchChannel);
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [channel, senderId, channelCurrent, timer]);

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
        }, DELAY_TIME_UNREAD_COUNT);
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
