import React, { useState, useEffect } from "react";
import "./App.css";
import { Input, Button, Dropdown, Menu } from "antd";
import { SendOutlined, SmileOutlined } from "@ant-design/icons";
import { auth, database } from "./Components/FirebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue, push, remove, child, update } from "firebase/database";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import PrivateChat from "./Components/PrivateChat";
import Register from "./Components/Register";
import Login from "./Components/Login";
import UserList from "./Components/UserList";
import { AuthProvider } from "./Components/useAuth";
import DeleteModal from "./Components/DeleteModal";
import MessageContainer from "./Components/MessageContainer";
import Picker from 'emoji-picker-react';

const AuthButtons = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className={"buttons"}>
            <Button
                type="primary"
                onClick={() => handleNavigation("/register")}
            >
                Регистрация
            </Button>
            <Button className={"exit"} type="primary" onClick={() => handleNavigation("/login")}>
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
    const [privateChatUser, setPrivateChatUser] = useState(null);

    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [usersData, setUsersData] = useState({});
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    const [lastNotificationMessageRef, setLastNotificationMessageRef] = useState(null);
    const [notifications, setNotifications] = useState({});



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
                setMessages(Object.entries(data).map(([id, value]) => ({...value, id})));

                if (user && isPrivateChat) {
                    const newNotifications = {};

                    Object.entries(data).forEach(([messageId, message]) => {
                        if (message.receiver === user.uid && !message.isRead) {
                            newNotifications[messageId] = message;

                            // Update the message to mark it as read
                            const messageRef = child(messagesRef, messageId);
                            update(messageRef, { isRead: true });
                        }
                    });

                    setNotifications(newNotifications);
                }
            }
        });
    }, [user, isPrivateChat]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Ошибка выхода:", error);
        }
    };

    const enterPrivateChat = () => {
        if (lastNotificationMessageRef === selectedUser) return;

        setIsPrivateChat(true);
        const messagesRef = ref(database, "messages");
        const messageData = {
            sender: user.uid,
            senderName: user.displayName,
            text: `пользователь ${user.displayName} вошел в личный диалог с вами.`,
            receiver: selectedUser,
        };
        const newMessageRef = push(messagesRef, messageData);
        setLastNotificationMessageRef(selectedUser);

        setTimeout(() => {
            remove(newMessageRef);
            setLastNotificationMessageRef(null);
        }, 2000);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (message.trim()) {
            const messagesRef = ref(database, "messages");
            const messageData = {
                sender: user.uid,
                senderName: user.displayName,
                text: message,
                receiver: isPrivateChat ? selectedUser : null,
                isRead: false,
            };
            push(messagesRef, messageData);
            setMessage("");
        }
    };

    const onEmojiClick = (emojiObject, event) => {
        const emoji = emojiObject.emoji;
        setMessage((prevMessage) => prevMessage + emoji);
    };

    const emojiPicker = (
        <Picker
            onEmojiClick={onEmojiClick}
            disableAutoFocus={true}
            style={{ position: "absolute", bottom: "40px", right: "10px" }}
        />
    );

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
                                {user && <div className="current-user">Здравствуйте, {user.displayName}</div>}

                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            isPublicChatVisible && (
                                                <MessageContainer
                                                    user={user}
                                                    setSelectedMessageId={setSelectedMessageId}
                                                    messages={messages}
                                                    usersData={usersData}
                                                />
                                            )
                                        }
                                    />
                                    <Route
                                        path="/private"
                                        element={
                                            <PrivateChat
                                                messages={messages}
                                                user={user}
                                                selectedUser={selectedUser}
                                                notifications={notifications}
                                            />
                                        }
                                    />
                                </Routes>
                                <form onSubmit={onSubmit} className="input-form">
                                    <Input
                                        placeholder="Введите сообщение"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        style={{ width: "100%" }}
                                        suffix={
                                            <Dropdown overlay={emojiPicker} trigger={["click"]} placement="topRight">
                                                <Button icon={<SmileOutlined />} />
                                            </Dropdown>
                                        }
                                    />
                                    <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                                        Отправить
                                    </Button>
                                </form>

                                {selectedMessageId && (
                                    <DeleteModal
                                        message={messages.find((msg) => msg.id === selectedMessageId)}
                                        visible={!!selectedMessageId}
                                        onCancel={() => setSelectedMessageId(null)}
                                        onConfirm={(messageId) => {
                                            const messagesRef = ref(database, "messages");
                                            remove(child(messagesRef, messageId));
                                            setSelectedMessageId(null);
                                        }}
                                    />
                                )}
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
                    {user && (
                        <UserList
                            setSelectedUser={setSelectedUser}
                            enterPrivateChat={enterPrivateChat}
                            user={user}
                            setPrivateChatUser={setPrivateChatUser}
                        />
                    )}
                </div>
            </Router>
        </AuthProvider>
    );

}

export default App;