import React, { useEffect, useState } from 'react';
import { List, Badge } from 'antd';
import { NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { ref, onValue } from 'firebase/database';
import { database } from './FirebaseConfig';

const UserList = ({ setSelectedUser, enterPrivateChat, user, setPrivateChatUser }) => {
    const [users, setUsers] = useState([]);
    const [usersWithNotifications, setUsersWithNotifications] = useState([]);

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

    const getRandomRGBColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    };

    const handleUserClick = (userId) => {
        setSelectedUser(userId);
        enterPrivateChat();
    };

    return (
        <div>
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
                            <UserOutlined style={{ color: getRandomRGBColor() }} /> {user.displayName}
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
