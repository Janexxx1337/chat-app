import React from 'react';
import { List } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";

const MessageList = ({ messages, user, usersData, handleDelete }) => {
    return (
        <List
            dataSource={messages ? messages.filter((msg) => !msg.receiver) : []}
            renderItem={(msg, index) => (
                <List.Item
                    key={msg.id}
                    actions={[
                        user && msg.sender === user.uid && (
                            <DeleteOutlined
                                key="delete"
                                onClick={() => handleDelete({ messageId: msg.id })}
                            />
                        ),
                    ].filter((action) => !isEmpty(action))}
                >
                    {msg.sender === user.uid ? "Вы: " : `${usersData[msg.sender]?.displayName || "пользователь"}: `}
                    {msg.text}
                </List.Item>
            )}
        />
    );
};

export default MessageList;
