import React, { useEffect, useState } from "react";
import { List } from "antd";
import { auth, database } from "./FirebaseConfig";
import { ref, onValue } from "firebase/database";

const UserList = () => {
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

    return (
        <div className="user-list">
            <h2>Пользователи:</h2>
            <List
                dataSource={users}
                renderItem={(user) => (
                    <List.Item key={user.uid}>
                        {user.displayName}
                    </List.Item>
                )}
            />
        </div>
    );
};

export default UserList;
