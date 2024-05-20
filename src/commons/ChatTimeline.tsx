import React, { useEffect, useRef, useState } from "react";
import { formatString, getTimeFromDate } from "../utils";
import MemberAvatar from "./MemberAvatar";
import TextMsg from "./TextMsg";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpinner from "./LoadingSpinner";
import AttachmentMsg from "./AttachmentMsg";
import { ERROR_MESSAGE } from "../constants";

export interface IProps {
  senderId: string;
  channelCurrent: any;
  primaryColor: string;
  setError: (err: any) => void;
}

const ChatTimeline = ({
  senderId,
  channelCurrent,
  primaryColor,
  setError,
}: IProps) => {
  const chatboxRef = useRef<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = 0;
    }
  }, [channelCurrent]);

  useEffect(() => {
    if (channelCurrent) {
      const messages = channelCurrent.state.messages;
      setMessages(messages);

      channelCurrent?.on("message.new", (event: any) => {
        setMessages(channelCurrent.state.messages);
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      });
    }
  }, [channelCurrent]);

  const fetchMoreMessages = async () => {
    try {
      setLoadingMore(true);
      const response = await channelCurrent.query({
        messages: { limit: 50, id_lt: messages[0]?.id },
      });

      if (response) {
        const allMessages = channelCurrent.state.messages;

        setMessages(allMessages);
        setLoadingMore(false);
      }
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGE);
      setLoadingMore(false);
    }
  };

  return (
    <div className="chatbox-timeline" ref={chatboxRef} id="scrollableDiv">
      <InfiniteScroll
        dataLength={messages.length}
        next={fetchMoreMessages}
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          position: "relative",
        }}
        inverse={true}
        hasMore={true}
        loader={loadingMore && <LoadingSpinner primaryColor={primaryColor} />}
        scrollableTarget="scrollableDiv"
      >
        <div className="listMessages">
          {messages.map((item: any) => {
            const isMyMessage = item.user.id === senderId;
            const name = formatString(item.user.id);
            return (
              <div
                className={`listMessages-item ${
                  isMyMessage ? "myMessage" : "otherMessage"
                }`}
                key={item.id}
              >
                <div className="messageItem">
                  <div className="messageItem-avatar">
                    <MemberAvatar member={item.user} width={26} height={26} />
                  </div>
                  <div className="messageItem-info">
                    <div className="messageItem-name">
                      <span className="span1">{name}</span>
                      <span className="span2">
                        {getTimeFromDate(item.created_at)}
                      </span>
                    </div>
                    <div className="messageItem-line">
                      {item.attachments && item.attachments.length > 0 ? (
                        <AttachmentMsg
                          message={item}
                          primaryColor={primaryColor}
                        />
                      ) : (
                        <TextMsg message={item} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ChatTimeline;
