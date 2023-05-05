import React from "react";
import { List } from "antd";

const PrivateChat = ({ messages, user, selectedUser }) => {
    return (
        <div className="messages-container">
            <List
                dataSource={messages.filter(
                    (msg) =>
                        (msg.sender === user.uid && msg.receiver === selectedUser) ||
                        (msg.sender === selectedUser && msg.receiver === user.uid)
                )}
                renderItem={(msg, index) => (
                    <List.Item key={index}>
                        {msg.sender === user.uid ? "Вы: " : `${msg.senderName || "unknown"}: `}
                        {msg.text}
                    </List.Item>
                )}
            />
        </div>
    );
};

export default PrivateChat;
