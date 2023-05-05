import React, {useState, useEffect} from "react";
import "./App.css";
import {Input, Button, List} from "antd";
import {SendOutlined, DeleteOutlined} from "@ant-design/icons";
import {auth, database} from "./Components/FirebaseConfig";
import {onAuthStateChanged, signOut} from "firebase/auth";
import { ref, onValue, push, remove, child } from "firebase/database";
import {BrowserRouter as Router, Route, Routes, Link, useNavigate} from "react-router-dom";
import PrivateChat from "./Components/PrivateChat";
import Register from "./Components/Register";
import Login from "./Components/Login";
import UserList from "./Components/UserList";
import {AuthProvider, useAuth} from "./Components/useAuth";
import DeleteModal from './Components/DeleteModal'


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
                style={{marginRight: "1rem"}}
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
    const [selectedUser, setSelectedUser] = useState(null);

    const [isPrivateChat, setIsPrivateChat] = useState(false);
    const [isPublicChatVisible, setIsPublicChatVisible] = useState(true);
    const [usersData, setUsersData] = useState({});

    const [selectedMessageId, setSelectedMessageId] = useState(null);


    const togglePublicChat = () => {
        setIsPublicChatVisible((prevVisibility) => !prevVisibility);
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const usersRef = ref(database, "users");
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setUsersData(data);
            }
        });
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

    const enterPrivateChat = () => {
        setIsPrivateChat(true);
        const messagesRef = ref(database, "messages");
        const messageData = {
            sender: user.uid,
            senderName: user.displayName,
            text: `пользователь ${user.displayName} вошел в личный диалог с вами.`,
            receiver: selectedUser,
        };
        push(messagesRef, messageData);
    };

    const handleDelete = (messageId) => {
        const messagesRef = ref(database, "messages");
        if (messageId) {
            remove(child(messagesRef, messageId));
        }
    };



    const leavePrivateChat = () => {
        setIsPrivateChat(false);
        setSelectedUser(null);
        const messagesRef = ref(database, "messages");
        const messageData = {
            sender: user.uid,
            senderName: user.displayName,
            text: `пользователь ${user.displayName} вы
шел из личного диалога.`,
            receiver: selectedUser,
        };
        push(messagesRef, messageData);
    };
    const onSubmit = (e) => {
        e.preventDefault();

        if (message.trim() !== "") {
            const messagesRef = ref(database, "messages");
            const messageData = {
                sender: user.uid,
                senderName: user.displayName,
                text: message,
                receiver: isPrivateChat ? selectedUser : null,
            };

            push(messagesRef, messageData);
            setMessage("");

            setTimeout(() => {
                const messagesRef = ref(database, "messages");
                const messageData = {
                    sender: user.uid,
                    senderName: user.displayName,
                    text: "",
                    receiver: selectedUser,
                };
                push(messagesRef, messageData);
            }, 2000);
        }
    };



    return (
        <AuthProvider>
            <Router>
                <div className="container">
                    <div className="chat">
                        {user ? (
                            <>
                                <div>
                                    <Link to="/">Общий чат</Link> | <Link to="/private">Личный диалог</Link>
                                </div>
                                <Button type="link" onClick={handleSignOut}>
                                    Выйти
                                </Button>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            isPublicChatVisible && (
                                                <div className="messages-container">
                                                    <List
                                                        dataSource={messages.filter((msg) => !msg.receiver)}
                                                        renderItem={(msg, index) => (
                                                            <List.Item
                                                                key={msg.id}
                                                                actions={[
                                                                    <DeleteOutlined key="delete" onClick={() => handleDelete({ messageId: msg.id })} />,
                                                                ]}
                                                            >

                                                            {msg.sender === user.uid ? "Вы: " : `${usersData[msg.sender]?.displayName || "пользователь"}: `}
                                                                {msg.text}
                                                            </List.Item>
                                                        )}
                                                    />

                                                </div>
                                            )}
                                    />
                                    <Route
                                        path="/private"
                                        element={<PrivateChat messages={messages} user={user}
                                                              selectedUser={selectedUser}/>}
                                    />
                                </Routes>
                                <form onSubmit={onSubmit} className="input-form">
                                    <Input
                                        placeholder="Введите сообщение"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        style={{width: "100%", marginRight: "1rem"}}
                                    />
                                    <Button type="primary" htmlType="submit" icon={<SendOutlined/>}>
                                        Отправить
                                    </Button>
                                </form>

                                {selectedMessageId && (
                                    <DeleteModal
                                        message={messages.find((msg) => msg.id === selectedMessageId)}
                                        visible={!!selectedMessageId}
                                        onCancel={() => setSelectedMessageId(null)}
                                        onConfirm={(message) => {
                                            const messagesRef = ref(database, "messages");
                                            remove(child(messagesRef, message.id));
                                            setSelectedMessageId(null);
                                        }}
                                    />
                                )}

                            </>
                        ) : (
                            <>
                                <AuthButtons/>
                                <Routes>
                                    <Route path="/register" element={<Register/>}/>
                                    <Route path="/login" element={<Login/>}/>
                                </Routes>
                            </>
                        )}
                    </div>
                    <UserList setSelectedUser={setSelectedUser} enterPrivateChat={enterPrivateChat}/>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

