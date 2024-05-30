import React, { useEffect, useState } from 'react';
import {
  capitalizeFirstLetter,
  getColorName,
  getFontSizeAvatar,
} from '../utils';

export interface IProps {
  senderId: string;
  channel: any;
  width: number;
  height: number;
  allUsers: any[];
}

const ChannelAvatar = ({
  senderId,
  channel,
  width,
  height,
  allUsers,
}: IProps) => {
  const [member, setMember] = useState<any>({ name: '', avatar: '' });

  useEffect(() => {
    if (channel) {
      const members = Object.values(channel.state.members);
      const otherMember: any = members.find(
        (member: any) => member.user_id !== senderId
      );

      if (otherMember) {
        const userInfo =
          allUsers && allUsers.find(user => user.id === otherMember.user.id);
        setMember(
          userInfo ? userInfo : { name: otherMember.user.id, avatar: '' }
        );
      } else {
        setMember({ name: '', avatar: '' });
      }
    } else {
      setMember({ name: '', avatar: '' });
    }
  }, [senderId, channel, allUsers]);

  return (
    <div
      className="avatar"
      style={{
        borderRadius: '50%',
        overflow: 'hidden',
        width: width,
        height: height,
      }}
    >
      {member.avatar ? (
        <img
          src={member.avatar}
          alt="avatar"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            background: getColorName(member.name),
            color: '#fff',
            fontWeight: 600,
            fontSize: getFontSizeAvatar(width),
          }}
        >
          {capitalizeFirstLetter(member.name)}
        </div>
      )}
    </div>
  );
};

export default ChannelAvatar;
