import React, { useState, useEffect, useCallback } from "react";
import { ErmisChat } from "ermis-js-sdk";
import { getChannelName } from "../../utils";
import ChannelAvatar from "../../commons/ChannelAvatar";
import {
  ChatIcon,
  ChatType,
  ERROR_MESSAGE,
  IconClose,
  NoChat,
  paramsQueryChannels,
} from "../../constants";
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
  placement?: any;
}

const BASE_URL = "https://api-staging.ermis.network";

const ErmisChatWidget = ({
  apiKey = "",
  openWidget = false,
  onToggleWidget,
  token,
  senderId,
  receiverId = "",
  primaryColor = "#173fcf",
  placement = { top: "auto", left: "auto", bottom: "30px", right: "30px" },
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
  const [openSidebar, setOpenSidebar] = useState<boolean>(true);
  const [openTimeline, setOpenTimeline] = useState<boolean>(true);

  const isMobile = window.innerWidth < 768;

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

  const fetchChannels = async () => {
    await chatClient
      .queryChannels(
        paramsQueryChannels.filter,
        paramsQueryChannels.sort,
        paramsQueryChannels.options
      )
      .then(async (response: any[]) => {
        setChannels(response);
      })
      .catch((err: any) => {
        setChannels([]);
        setError(err.message || ERROR_MESSAGE);
      });
  };

  const createChannelOfReceiver = async () => {
    if (lowCaseReceiverId) {
      try {
        const newChannel = chatClient.channel(ChatType.Messaging, {
          members: [lowCaseReceiverId, lowCaseSenderId],
        });
        await newChannel.create();
        setChannelCurrent(newChannel);
      } catch (err: any) {
        setError(err.message || ERROR_MESSAGE);
        return null;
      }
    }
  };

  const connectChannelOfReceiver = async (channel: any) => {
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
      setChannelCurrent(null);
      setError(err.message || ERROR_MESSAGE);
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
          setChannels(response);
          if (lowCaseReceiverId) {
            const channelOfReceiver = response.find((channel: any) =>
              Object.values(channel.data.members).some(
                (member: any) => member.user_id === lowCaseReceiverId
              )
            );
            if (channelOfReceiver) {
              console.log("----------connect existing channel----------");
              connectChannelOfReceiver(channelOfReceiver);
            } else {
              console.log("----------create new channel----------");
              createChannelOfReceiver();
            }
          }
        })
        .catch((err: any) => {
          setError(err.message || ERROR_MESSAGE);
        });
    } else {
      setChannelCurrent(null);
      setChannels([]);
    }
  }, [lowCaseReceiverId, isLoggedIn, openWidget]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    chatClient.on("notification.added_to_channel", async (event) => {
      fetchChannels();
    });
  }, []);

  useEffect(() => {
    console.log("isMobile", isMobile);
    if (isMobile) {
      if (channelCurrent) {
        setOpenSidebar(false);
        setOpenTimeline(true);
      } else {
        setOpenSidebar(true);
        setOpenTimeline(false);
      }
    }
  }, [isMobile, channelCurrent]);

  return (
    <div
      className={`chatbox-container ${openWidget ? "show-chatbox" : ""}`}
      style={{
        top: placement.top,
        left: placement.left,
        right: placement.right,
        bottom: placement.bottom,
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
        <span className="material-symbols-outlined">
          <IconClose width={18} height={18} color="#fff" />
        </span>
      </button>

      {/* -----------chatbox-wrapper--------- */}
      <div className="chatbox-wrapper">
        <header style={{ background: primaryColor }}>
          <h2>Chat</h2>
          <span
            className="close-btn material-symbols-outlined"
            onClick={toggleChatbox}
          >
            <IconClose width={18} height={18} color="#fff" />
          </span>
        </header>
        <main>
          {/* -----------chatbox-list--------- */}
          {openSidebar && (
            <div className="chatbox-sidebar">
              <ChannelList
                chatClient={chatClient}
                senderId={lowCaseSenderId}
                channels={channels}
                channelCurrent={channelCurrent}
                setChannelCurrent={setChannelCurrent}
                setError={setError}
              />
            </div>
          )}

          {openTimeline && (
            <div className="chatbox-cont">
              {channelCurrent ? (
                <>
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
          )}
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
