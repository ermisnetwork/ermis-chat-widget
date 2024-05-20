import React from "react";
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
declare const ErmisChatWidget: ({ apiKey, openWidget, onToggleWidget, token, senderId, receiverId, primaryColor, }: ChatWidgetIProps) => React.JSX.Element;
export default ErmisChatWidget;
