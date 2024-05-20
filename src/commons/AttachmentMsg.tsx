import React from "react";
import { getIconFile, getSizeInMb } from "../utils";

export interface IProps {
  message: any;
  primaryColor: string;
}

const AttachmentMsg = ({ message, primaryColor }: IProps) => {
  const attachments = message.attachments;

  return (
    <>
      <div className="msgAttachments">
        {attachments.map((item: any, index: number) => {
          const type = item.type;

          return (
            <div className="msgAttachments-item" key={index}>
              {type === "image" ? (
                <img
                  src={item.image_url}
                  alt={item.fallback}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "12px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : type === "video" ? (
                <video
                  controls
                  src={item.asset_url}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "12px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div className="msgAttachments-file">
                  <div className="msgAttachments-file-icon">
                    {getIconFile(item.mime_type, 30, 30, primaryColor)}
                  </div>
                  <div className="msgAttachments-file-data">
                    <p className="p1">{item.title}</p>
                    <p
                      className="p2"
                      style={{ fontSize: "12px", color: "#777" }}
                    >
                      {getSizeInMb(item.file_size)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {message.text && <div style={{ marginTop: "5px" }}>{message.text}</div>}
      </div>
    </>
  );
};

export default AttachmentMsg;
