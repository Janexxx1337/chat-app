import React, { useState, useEffect } from "react";
import { List } from "antd";
import { database } from "./FirebaseConfig";
import { ref, onValue } from "firebase/database";
import { useAuth } from "./useAuth";

const UserList = ({ setSelectedUser, enterPrivateChat }) => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const usersRef = ref(database, "users");
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setUsers(Object.values(data));
            }
        });
    }, []);

    const handleUserClick = (userId) => {
        setSelectedUser(userId);
        enterPrivateChat();
    };

    return (
        <div>
            <h2>Список пользователей</h2>
            <List
                dataSource={users}
                renderItem={(user) => (
                    <List.Item key={user.uid} onClick={() => handleUserClick(user.uid)}>
                        {user.displayName}
                    </List.Item>
                )}
            />
        </div>
    );
};

export default UserList;
