import React from "react";
export interface IProps {
    member: any;
    width: number;
    height: number;
}
declare const MemberAvatar: ({ member, width, height }: IProps) => React.JSX.Element;
export default MemberAvatar;
