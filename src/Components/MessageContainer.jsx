import {List} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {isEmpty} from "lodash";
import React from "react";

const MessageContainer = (prop) => {

    const handleDelete = (message) => {

        if (prop.user && message.sender === prop.user.uid) {
            prop.setSelectedMessageId(message.id);
        }
    };

    return (
        <div className="messages-container">
            <List
                dataSource={prop.messages.filter((msg) => !msg.receiver)}
                renderItem={(msg, index) => (
                    <List.Item
                        key={msg.id}
                        actions={[
                            prop.user && msg.sender === prop.user.uid && (
                                <DeleteOutlined
                                    key="delete"
                                    onClick={() => handleDelete(msg)}
                                />

                            ),
                        ].filter((action) => !isEmpty(action))}
                    >
                        {msg.sender === prop.user.uid ? "Вы: " : `${prop.usersData[msg.sender]?.displayName || "пользователь"}: `}
                        {msg.text}
                    </List.Item>
                )}
            />
        </div>
    )
}

export default MessageContainer