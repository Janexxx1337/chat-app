import React, { useState, useEffect } from "react";
import "./App.css";
import { Input, Button, List } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { auth, database } from "./Components/FirebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue, push } from "firebase/database";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Register from "./Components/Register";
import Login from "./Components/Login";
import UserList from "./Components/UserList";

const AuthButtons = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className={'buttons'}>
            <Button
                type="primary"
                onClick={() => handleNavigation("/register")}
                style={{ marginRight: "1rem" }}
            >
                Регистрация
            </Button>
            <Button className={'exit'} type="primary" onClick={() => handleNavigation("/login")}>
                Вход
            </Button>
        </div>
    );
};

function App() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const messagesRef = ref(database, "messages");
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setMessages(Object.values(data));
            }
        });
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Ошибка выхода:", error);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (message && user) {
            const messagesRef = ref(database, "messages");
            push(messagesRef, {
                sender: user.uid,
                senderName: user.displayName,
                text: message,
            });
            setMessage("");
        }
    };

    return (
        <Router>
            <div className="container">
                <div className="chat">
                    {user ? (
                        <>
                            <Button type="link" onClick={handleSignOut}>
                                Выйти
                            </Button>
                            <List
                                dataSource={messages}
                                renderItem={(msg, index) => (
                                    <List.Item key={index}>
                                        {msg.sender === user.uid
                                            ? "Вы: "
                                            : `${msg.senderName || "unknown"}: `}
                                        {msg.text}
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
                        </>
                    ) : (
                        <>
                            <AuthButtons />
                            <Routes>
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                            </Routes>
                        </>
                    )}
                </div>
                <UserList />
            </div>
        </Router>
    );
}

export default App
