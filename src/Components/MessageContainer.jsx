import { useSwipeable } from 'react-swipeable';
import {List} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {isEmpty} from "lodash";
import React from "react";

const MessageItem = ({ msg, user, usersData, handleDelete }) => {
    const handlers = useSwipeable({
        onSwipedLeft: () => handleDelete(msg)
    });

    return (
        <div {...handlers}>
            <List.Item
                key={msg.id}
                actions={[
                    user && msg.sender === user.uid && (
                        <DeleteOutlined
                            key="delete"
                            onClick={() => handleDelete(msg)}
                        />
                    ),
                ].filter((action) => !isEmpty(action))}
            >
                {msg.sender === user.uid ? "Вы: " : `${usersData[msg.sender]?.displayName || "пользователь"}: `}
                {msg.text}
            </List.Item>
        </div>
    );
};

const MessageContainer = (props) => {

    const handleDelete = (message) => {
        if (props.user && message.sender === props.user.uid) {
            props.setSelectedMessageId(message.id);
        }
    };

    return (
        <div className="messages-container">
            <List
                dataSource={props.messages.filter((msg) => !msg.receiver)}
                renderItem={(msg, index) => (
                    <MessageItem
                        msg={msg}
                        user={props.user}
                        usersData={props.usersData}
                        handleDelete={handleDelete}
                    />
                )}
            />
        </div>
    )
}

export default MessageContainer;
