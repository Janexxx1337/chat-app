import React, { useEffect, useState } from 'react';
import { List } from 'antd';
import { ref, onValue } from 'firebase/database';
import { database } from './FirebaseConfig';


const UserList = ({ setSelectedUser, enterPrivateChat, user }) => {
    const [users, setUsers] = useState([]);
    const [userMessageStatus, setUserMessageStatus] = useState({});


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
                setUserMessageStatus(messageStatus);
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

    const filteredUsers = users.filter((u) => u.uid !== user?.uid); // Отфильтруйте текущего пользователя

    return (
        <div>
            <h3>Список пользователей:</h3>
            <List
                dataSource={filteredUsers} // Используйте отфильтрованный список пользователей
                renderItem={(user) => (
                    <List.Item
                        key={user.uid}
                        onClick={() => {
                            setSelectedUser(user.uid);
                            enterPrivateChat();
                        }}
                    >
                        {user.displayName}
                    </List.Item>
                )}
            />
        </div>
    );
};

export default UserList;
