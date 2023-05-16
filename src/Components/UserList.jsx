import React, { useEffect, useState } from 'react';
import { List, Badge, Avatar, Tooltip, Input } from 'antd';
import { UserOutlined, NotificationOutlined, SearchOutlined } from '@ant-design/icons';
import { ref,onValue, child, update } from "firebase/database";
import { database } from './FirebaseConfig';
import { useNavigate } from "react-router-dom";

const UserList = ({ setSelectedUser, setIsPrivateChat, user, setPrivateChatUser, isUserListVisible }) => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [usersWithNotifications, setUsersWithNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

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

    const handleSearch = (event) => {
        setSearch(event.target.value);
    }

    const filteredUsers = users
        .filter((u) => u.uid !== user?.uid)
        .filter((u) => u.displayName && u.displayName.toLowerCase().includes(search.toLowerCase()));


    const handleUserClick = (userId) => {
        setSelectedUser(userId);
        setPrivateChatUser(userId);
        setIsPrivateChat(true);
        navigate('/private');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        isUserListVisible && (
            <div className={'user-list'}>
                <Input
                    placeholder="Поиск по контактам..."
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={handleSearch}
                    style={{ marginBottom: '1rem' }}
                />
                <List
                    dataSource={paginatedUsers}
                    renderItem={(user, index) => (
                        <List.Item
                            key={user.uid}
                            onClick={() => handleUserClick(user.uid)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Badge dot={usersWithNotifications.includes(user.uid)}>
                                <Tooltip title={user.displayName}>
                                    <Avatar
                                        src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}` || ''}
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
                    pagination={{
                        current: currentPage,
                        pageSize,
                        total: filteredUsers.length,
                        onChange: handlePageChange
                    }}
                />
            </div>
        )
    );
};

export default UserList;