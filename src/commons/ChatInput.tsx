import React, { useRef, useState } from "react";
import { getIconFile, getSizeInMb, uuidv4 } from "../utils";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  ERROR_MESSAGE,
  IconClose,
  IconEmoji,
  IconFile,
  IconFileAudio,
  IconFileVideo,
  IconLink,
} from "../constants";
import LoadingSpinner from "./LoadingSpinner";

export interface IProps {
  primaryColor: string;
  senderId: string;
  channelCurrent: any;
  setError: (err: any) => void;
}

const ChatInput = ({
  primaryColor,
  senderId,
  channelCurrent,
  setError,
}: IProps) => {
  const chatInputRef = useRef<any>(null);
  const [text, setText] = useState<string>("");
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [files, setFiles] = useState<any[]>([]);

  const onSendMessage = async () => {
    try {
      const uuid = uuidv4();
      const messageId = `${senderId}-${uuid}`;

      const result = await channelCurrent?.sendMessage({
        id: messageId,
        text: text.trim(),
        attachments: getAttachments(),
        mentioned_users: [],
      });

      if (result) {
        setText("");
        setFiles([]);
      }
    } catch (err: any) {
      setText("");
      setFiles([]);
      setError(err.message || ERROR_MESSAGE);
    }
  };

  const checkDisabledButton = () => {
    if (
      (text.trim() === "" && files.length === 0) ||
      (files.length > 0 && files.some((item) => item.loading || item.error))
    ) {
      return true;
    }
    return false;
  };

  const handleInputChange = (event: any) => {
    setText(event.target.value);
    chatInputRef.current.style.height = `${chatInputRef.current.scrollHeight}px`;
  };

  const handleKeyPress = (event: any) => {
    if (
      text &&
      event.key === "Enter" &&
      !event.shiftKey &&
      window.innerWidth > 800
    ) {
      event.preventDefault();
      onSendMessage();
    }
  };

  const handleEmojiClick = (emoji: any) => {
    const input = chatInputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setText(
        text.substring(0, selectionStart) + emoji + text.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  };

  const onChangeUpload = (event: any) => {
    const filesArr = Array.from(event.target.files).map((file: any) => {
      return {
        loading: true,
        type: file.type,
        name: file.name,
        size: file.size,
        error: false,
        url: "",
      };
    });

    setFiles(filesArr);

    Array.from(event.target.files).forEach(async (file: any) => {
      try {
        const response = await channelCurrent.sendFile(file);
        setFiles((prev) => {
          return prev.map((item) => {
            if (item.name === file.name) {
              return {
                ...item,
                loading: false,
                url: response.file,
              };
            }
            return item;
          });
        });
      } catch (error) {
        setFiles((prev) => {
          return prev.map((item) => {
            if (item.name === file.name) {
              return {
                ...item,
                loading: false,
                error: true,
              };
            }
            return item;
          });
        });
      }
    });
  };

  const onRemoveFile = (index: number) => {
    setFiles((prev) => {
      return prev.filter((_, i) => i !== index);
    });
  };

  const getAttachments = () => {
    if (files.length === 0) return [];

    const attachments = files
      .filter((item) => !item.error)
      .map((file) => {
        const type = file.type.split("/")[0];
        switch (type) {
          case "image":
            return {
              fallback: file.name,
              type: "image",
              image_url: file.url,
            };
          case "video":
            return {
              type: "video",
              asset_url: file.url,
              file_size: file.size,
              mime_type: file.type,
              title: file.name,
            };
          case "application":
            return {
              type: "file",
              asset_url: file.url,
              file_size: file.size,
              mime_type: file.type,
              title: file.name,
            };
          default:
            return {
              type: "file",
              asset_url: file.url,
              mime_type: "",
              title: file.name,
            };
        }
      });
    return attachments || [];
  };

  const renderMedia = (data: any) => {
    const fileType = data.type.split("/")[0];

    const sizeInMB = getSizeInMb(data.size);

    switch (fileType) {
      case "image":
        return (
          <img
            src={data.url}
            alt={data.name}
            style={{
              width: "60px",
              height: "60px",
              objectFit: "cover",
            }}
          />
        );
      case "video":
        return (
          <div className="attachment-cont" title={data.name}>
            <div className="attachment-icon">
              <IconFileVideo width={24} height={24} color={primaryColor} />
            </div>
            <div className="attachment-data">
              <p className="p1">{data.name}</p>
              <p className="p2">{sizeInMB}</p>
            </div>
          </div>
        );
      case "audio":
        return (
          <div className="attachment-cont" title={data.name}>
            <div className="attachment-icon">
              <IconFileAudio width={24} height={24} color={primaryColor} />
            </div>
            <div className="attachment-data">
              <p className="p1">{data.name}</p>
              <p className="p2">{sizeInMB}</p>
            </div>
          </div>
        );
      case "application":
        return (
          <div className="attachment-cont" title={data.name}>
            <div className="attachment-icon">
              {getIconFile(data.type, 24, 24, primaryColor)}
            </div>
            <div className="attachment-data">
              <p className="p1">{data.name}</p>
              <p className="p2">{sizeInMB}</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="attachment-cont" title={data.name}>
            <div className="attachment-icon">
              <IconFile width={24} height={24} color={primaryColor} />
            </div>
            <div className="attachment-data">
              <p className="p1">{data.name}</p>
              <p className="p2">{sizeInMB}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="chatbox-input">
      {files.length > 0 && (
        <div className="chatbox-input-attachment">
          {files.map((item: any, index: number) => {
            return (
              <div className="attachment-col" key={index}>
                <div className="attachment-item">
                  {item.loading ? (
                    <div
                      style={{
                        backgroundColor: "#d6d6d6",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <LoadingSpinner primaryColor={primaryColor} />
                    </div>
                  ) : item.error ? (
                    <div
                      style={{
                        border: "1px solid #d32f2f",
                        fontSize: "14px",
                        color: "#d32f2f",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Error
                    </div>
                  ) : (
                    renderMedia(item)
                  )}
                </div>
                <div
                  className="attachment-remove"
                  onClick={() => onRemoveFile(index)}
                >
                  <IconClose width={20} height={20} color={"#d32f2f"} />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="chatbox-input-textarea">
        <textarea
          ref={chatInputRef}
          placeholder="Send a Message"
          spellCheck="false"
          required
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <div className="chatbox-input-emoji">
          <button
            type="button"
            onClick={(event: any) => {
              event.stopPropagation();
              setShowPicker(!showPicker);
            }}
          >
            <IconEmoji />
          </button>
          {showPicker && (
            <div className="chatbox-picker">
              <Picker
                data={data}
                onEmojiSelect={(emoji: any) => {
                  handleEmojiClick(emoji.native);
                }}
                onClickOutside={() => setShowPicker(false)}
              />
            </div>
          )}
        </div>
        <div className="chatbox-input-upload">
          <label>
            <IconLink />
            <input
              id="file-input"
              type="file"
              multiple
              onChange={onChangeUpload}
            />
          </label>
        </div>
      </div>
      <div
        className={`chatbox-input-send ${
          checkDisabledButton() ? "disabled" : ""
        }`}
      >
        <span
          id="send-btn"
          className="material-symbols-outlined"
          onClick={onSendMessage}
          style={{
            color: primaryColor,
          }}
        >
          send
        </span>
      </div>
    </div>
  );
};

export default ChatInput;
