import { useSwipeable } from 'react-swipeable';
import { List } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";
import React, { useState } from "react";

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

const MessageContainer = ({ messages, user, usersData, setSelectedMessageId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const handleDelete = (message) => {
        if (user && message.sender === user.uid) {
            setSelectedMessageId(message.id);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedMessages = messages.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="messages-container">
            <List
                dataSource={paginatedMessages}
                renderItem={(msg, index) => (
                    <MessageItem
                        msg={msg}
                        user={user}
                        usersData={usersData}
                        handleDelete={handleDelete}
                    />
                )}
                pagination={{
                    current: currentPage,
                    pageSize,
                    total: messages.length,
                    onChange: handlePageChange
                }}
            />
        </div>
    )
}

export default MessageContainer;
