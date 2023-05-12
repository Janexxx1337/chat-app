import React, { useEffect, useState } from 'react';
import { List, Badge } from 'antd';
import { ManOutlined, NotificationOutlined, SmileOutlined, UserOutlined, WomanOutlined } from '@ant-design/icons';
import { ref, onValue } from 'firebase/database';
import { database } from './FirebaseConfig';
import { useNavigate } from "react-router-dom";


const UserList = ({ setSelectedUser, setIsPrivateChat, user, setPrivateChatUser }) => {
    const [users, setUsers] = useState([]);
    const [usersWithNotifications, setUsersWithNotifications] = useState([]);

    const navigate = useNavigate();

    const icons = [<UserOutlined />, <WomanOutlined />, <ManOutlined />, <SmileOutlined />];

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
                            {React.cloneElement(icons[index % icons.length], { style: { color: getRandomRGBColor() } })}
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
