import React from "react";
export interface IProps {
    message: any;
    primaryColor: string;
}
declare const AttachmentMsg: ({ message, primaryColor }: IProps) => React.JSX.Element;
export default AttachmentMsg;
