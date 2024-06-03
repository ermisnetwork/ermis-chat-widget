import React from 'react';
import ChannelItem from './ChannelItem';

export interface IProps {
  chatClient: any;
  channels: any[];
  senderId: string;
  channelCurrent: any;
  setChannelCurrent: (channel: any) => void;
  setError: (err: any) => void;
  allUsers: any[];
  allUnreadCount: any;
  fetchAllUnreadCount: (senderId: string) => void;
}

const ChannelList = ({
  chatClient,
  channels,
  senderId,
  channelCurrent,
  setChannelCurrent,
  setError,
  allUsers,
  allUnreadCount,
  fetchAllUnreadCount,
}: IProps) => {
  return (
    <div className="chatbox-list">
      {channels.length > 0 ? (
        channels.map((channel: any) => {
          return (
            <div className="chatbox-list-col" key={channel.id}>
              <ChannelItem
                chatClient={chatClient}
                channel={channel}
                senderId={senderId}
                channelCurrent={channelCurrent}
                setChannelCurrent={setChannelCurrent}
                setError={setError}
                allUsers={allUsers}
                allUnreadCount={allUnreadCount}
                fetchAllUnreadCount={fetchAllUnreadCount}
              />
            </div>
          );
        })
      ) : (
        <div className="chatbox-list-empty">
          <p>No conversion yet</p>
        </div>
      )}
    </div>
  );
};

export default ChannelList;
