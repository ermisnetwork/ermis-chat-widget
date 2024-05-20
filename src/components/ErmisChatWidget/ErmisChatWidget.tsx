import React, { useState, useEffect, useCallback } from "react";
import { ErmisChat } from "ermis-js-sdk";
import { getChannelName } from "../../utils";
import ChannelAvatar from "../../commons/ChannelAvatar";
import { ChatIcon, ChatType, ERROR_MESSAGE, NoChat } from "../../constants";
import ChannelList from "../../commons/ChannelList";
import ChatTimeline from "../../commons/ChatTimeline";
import ChatInput from "../../commons/ChatInput";
import Notification from "../../commons/Notification";
import "./style.css";

interface ChatWidgetIProps {
  apiKey: string;
  openWidget: boolean;
  onToggleWidget: () => void;
  token: string;
  senderId: string;
  receiverId?: string;
  primaryColor?: string;
}

const BASE_URL = "http://210.79.176.52:8558";

const paramsQueryChannels: any = {
  filter: { type: ChatType.Messaging },
  sort: [{ last_message_at: -1 }],
  options: {
    limit: 10,
    offset: 0,
    message_limit: 25,
    presence: true,
    watch: true,
  },
};

const ErmisChatWidget = ({
  apiKey = '',
  openWidget = false,
  onToggleWidget,
  token,
  senderId,
  receiverId = "",
  primaryColor = "#eb4034",
}: ChatWidgetIProps) => {

  const chatClient = ErmisChat.getInstance(apiKey, {
    enableInsights: true,
    enableWSFallback: true,
    allowServerSideConnect: true,
    baseURL: BASE_URL,
  });

  const lowCaseSenderId = senderId.toLowerCase();
  const lowCaseReceiverId = receiverId.toLowerCase() || "";
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [channelCurrent, setChannelCurrent] = useState<any>(null);
  const [channels, setChannels] = useState<any>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (lowCaseSenderId && token) {
      const connectUser = async () => {
        try {
          await chatClient.connectUser(
            {
              api_key: apiKey,
              id: lowCaseSenderId,
              name: lowCaseSenderId,
              image: "",
            },
            `Bearer ${token}`
          );
          setIsLoggedIn(true);
        } catch (err: any) {
          setError(err.message || ERROR_MESSAGE);
        }
      };
      connectUser();
    } else {
      setIsLoggedIn(false);
    }
  }, [lowCaseSenderId, token]);

  const toggleChatbox = () => {
    onToggleWidget();
  };

  const getFriendIds = (channels: any[]) => {
    const friendIds = channels.map((channel: any) => {
      const dataUser: any = Object.values(channel.data.members).find(
        (member: any) => member.user.id !== lowCaseSenderId
      );
      return dataUser ? dataUser.user.id : "";
    });

    return friendIds || [];
  };

  const findChannelOfReceiverId = async (channels: any[]) => {
    const channel = channels.find((channel: any) => {
      return channel.data.members.find(
        (member: any) => member.user.id === lowCaseReceiverId
      );
    });

    if (channel) {
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
    }

    return null;
  };

  const createChannel = async () => {
    try {
      const newChannel = await chatClient.channel(ChatType.Messaging, {
        members: [lowCaseReceiverId, lowCaseSenderId],
      });
      await newChannel.create();
      return newChannel;
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGE);
      return null;
    }
  };

  const getData = useCallback(async () => {
    if (isLoggedIn && openWidget) {
      // get list channel
      await chatClient
        .queryChannels(
          paramsQueryChannels.filter,
          paramsQueryChannels.sort,
          paramsQueryChannels.options
        )
        .then(async (response: any) => {
          const friendIds = getFriendIds(response);
          if (!lowCaseReceiverId) {
            setChannels(response);
          } else if (friendIds.includes(lowCaseReceiverId)) {
            // check receiverId existing in list channel
            setChannels(response);
            findChannelOfReceiverId(response);
          } else {
            // create new channel with receiverId
            const newChannel = await createChannel();
            if (newChannel) {
              const newListChannel = response.push(newChannel);
              setChannels(newListChannel);
              findChannelOfReceiverId(newListChannel);
            } else {
              setChannels(response);
            }
          }
        })
        .catch((err: any) => {
          setError(err.message || ERROR_MESSAGE);
        });
    }
  }, [lowCaseReceiverId, isLoggedIn, openWidget]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div
      className={`chatbox-container ${openWidget ? "show-chatbox" : ""}`}
      style={{
        background: primaryColor,
        backgroundColor: primaryColor,
      }}
    >
      <button
        className="chatbox-toggler"
        onClick={toggleChatbox}
        style={{ background: primaryColor }}
      >
        <span className="material-symbols-rounded">
          <ChatIcon />
        </span>
        <span className="material-symbols-outlined">Close</span>
      </button>

      {/* -----------chatbox-wrapper--------- */}
      <div className="chatbox-wrapper">
        <header style={{ background: primaryColor }}>
          <h2>Ermis chat</h2>
          <span
            className="close-btn material-symbols-outlined"
            onClick={toggleChatbox}
          >
            close
          </span>
        </header>
        <main>
          {/* -----------chatbox-list--------- */}
          <ChannelList
            chatClient={chatClient}
            senderId={lowCaseSenderId}
            channels={channels}
            channelCurrent={channelCurrent}
            setChannelCurrent={setChannelCurrent}
            setError={setError}
          />
          <div className="chatbox-cont">
            {channelCurrent ? (
              <>
                {/* -----------chatbox-header--------- */}
                <div className="chatbox-header">
                  <div className="chatbox-header-name">
                    <ChannelAvatar
                      senderId={lowCaseSenderId}
                      channel={channelCurrent}
                      width={30}
                      height={30}
                    />
                    <p className="p1">
                      {getChannelName(channelCurrent, lowCaseSenderId)}
                    </p>
                  </div>
                </div>
                {/* -----------chatbox-body--------- */}
                <div className="chatbox-body">
                  <ChatTimeline
                    senderId={lowCaseSenderId}
                    channelCurrent={channelCurrent}
                    primaryColor={primaryColor}
                    setError={setError}
                  />
                  {/* -----------chatbox-input--------- */}
                  <ChatInput
                    primaryColor={primaryColor}
                    senderId={lowCaseSenderId}
                    channelCurrent={channelCurrent}
                    setError={setError}
                  />
                </div>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <NoChat />
              </div>
            )}
          </div>
        </main>
        {/* -----------notification--------- */}
        {error && (
          <Notification message={error} onClose={() => setError(null)} />
        )}
      </div>
    </div>
  );
};

export default ErmisChatWidget;
