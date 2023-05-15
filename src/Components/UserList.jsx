import React, { useEffect, useState } from 'react';
import { List, Badge, Avatar, Tooltip } from 'antd';
import { UserOutlined, NotificationOutlined } from '@ant-design/icons';
import { ref, onValue } from 'firebase/database';
import { database } from './FirebaseConfig';
import { useNavigate } from "react-router-dom";

const UserList = ({ setSelectedUser, setIsPrivateChat, user, setPrivateChatUser }) => {
    const [users, setUsers] = useState([]);
    const [usersWithNotifications, setUsersWithNotifications] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const messagesRef = ref(database, 'messages');
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const messages = Object.values(data);
                const messageStatus = {};
                messages.forEach((msg) => {
                    if (msg.sender === user.uid) {
                        messageStatus[msg.receiver] = true;
                    }
                });
                setUsersWithNotifications(Object.keys(messageStatus));
            }
        });
    }, [user.uid]);

    useEffect(() => {
        const usersRef = ref(database, 'users');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setUsers(Object.values(data));
            }
        });
    }, []);

    const filteredUsers = users.filter((u) => u.uid !== user?.uid);

    const handleUserClick = (userId) => {
        setSelectedUser(userId);
        setPrivateChatUser(userId);
        setIsPrivateChat(true);
        navigate('/private');
    };

    return (
        <div className={'user-list'}>
            <h3>Список пользователей:</h3>
            <List
                dataSource={filteredUsers}
                renderItem={(user, index) => (
                    <List.Item
                        key={user.uid}
                        onClick={() => handleUserClick(user.uid)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Badge dot={usersWithNotifications.includes(user.uid)}>
                            <Tooltip title={user.displayName}>
                                <Avatar
                                    src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                                    icon={<UserOutlined />}
                                />
                            </Tooltip>
                            {user.displayName}
                            {usersWithNotifications.includes(user.uid) && (
                                <NotificationOutlined style={{ marginLeft: 8 }} />
                            )}
                        </Badge>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default UserList;
