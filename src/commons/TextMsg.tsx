import React from "react";

export interface IProps {
  message: any;
}

const TextMsg = ({ message }: IProps) => {
  return <div>{message.text}</div>;
};

export default TextMsg;
