import React, { useEffect, useState } from "react";
import {
  capitalizeFirstLetter,
  getColorName,
  getFontSizeAvatar,
} from "../utils";

export interface IProps {
  member: any;
  width: number;
  height: number;
}

const MemberAvatar = ({ member, width, height }: IProps) => {
  const [memberName, setMemberName] = useState<string>("");
  const [memberAvatar, setMemberAvatar] = useState<string>("");

  useEffect(() => {
    if (member) {
      setMemberName(member.id);
      setMemberAvatar(member.img ? member.img : "");
    }
  }, [ member]);

  return (
    <div
      className="avatar"
      style={{
        borderRadius: "50%",
        overflow: "hidden",
        width: width,
        height: height,
      }}
    >
      {memberAvatar ? (
        <img
          src={memberAvatar}
          alt="avatar"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            background: getColorName(memberName),
            color: "#fff",
            fontWeight: 600,
            fontSize: getFontSizeAvatar(width),
          }}
        >
          {capitalizeFirstLetter(memberName)}
        </div>
      )}
    </div>
  );
};

export default MemberAvatar;
