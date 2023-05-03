import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push } from "firebase/database";
import "./App.css";
import { Input, Button, List } from "antd";
import { SendOutlined } from "@ant-design/icons";
import FirebaseConfig from "./Components/FirebaseConfig";


const app = initializeApp(FirebaseConfig);
const database = getDatabase(app);

function App() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const messagesRef = ref(database, "messages");
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setMessages(Object.values(data));
            }
        });
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        if (message) {
            const messagesRef = ref(database, "messages");
            push(messagesRef, message);
            setMessage("");
        }
    };

    return (
        <div className="App">
            <List
                dataSource={messages}
                renderItem={(msg, index) => (
                    <List.Item key={index}>
                        {msg}
                    </List.Item>
                )}
            />
            <form onSubmit={onSubmit} className="input-form">
                <Input
                    placeholder="Введите сообщение"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: "100%", marginRight: "1rem" }}
                />
                <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                    Отправить
                </Button>
            </form>
        </div>
    );
}

export default App;
