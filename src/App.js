import React, {useState, useEffect} from "react";
import "./App.css";
import {Button, Switch} from "antd";
import {auth, database} from "./Components/FirebaseConfig";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {ref, onValue, push, remove, child, update} from "firebase/database";
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateChat from "./Components/PrivateChat";
import Register from "./Components/Register";
import Login from "./Components/Login";
import UserList from "./Components/UserList";
import {AuthProvider} from "./Components/useAuth";
import DeleteModal from "./Components/DeleteModal";
import MessageContainer from "./Components/MessageContainer";
import AuthButtons from "./Components/AuthButtons";
import MessageForm from "./Components/MessageForm";
import PublicChat from "./Components/PublicChat";
import {AliwangwangOutlined, UserOutlined} from "@ant-design/icons";

function App() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const [user, setUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [isPrivateChat, setIsPrivateChat] = useState(false);
    const [privateChatUser, setPrivateChatUser] = useState(null);


    const [isUserListVisible, setIsUserListVisible] = useState(false);

    const [usersData, setUsersData] = useState({});
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    const [lastNotificationMessageRef, setLastNotificationMessageRef] = useState(null);
    const [notifications, setNotifications] = useState({});

    const [isDarkTheme, setIsDarkTheme] = useState(false);


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
        if (isDarkTheme) {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }
    }, [isDarkTheme]);

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

                            const messageRef = child(messagesRef, messageId);
                            update(messageRef, {isRead: true});
                        }
                    });

                    setNotifications(newNotifications);
                }
            }
        });
    }, [user, isPrivateChat]);

    const onEmojiClick = (emojiKey) => {
        setMessage((prevMessage) => prevMessage + emojiKey);
    };


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

            if (isPrivateChat) {
                const notificationsRef = ref(database, "notifications");
                const notificationData = {
                    sender: user.uid,
                    senderName: user.displayName,
                    receiver: selectedUser,
                    text: message,
                    isRead: false,
                };
                push(notificationsRef, notificationData);
            }

            setMessage("");
        }
    };

    useEffect(() => {
        if (user) {
            const notificationsRef = ref(database, "notifications");
            onValue(notificationsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Отфильтровываем уведомления, которые предназначены для текущего пользователя
                    const userNotifications = Object.entries(data).filter(
                        ([id, notification]) => notification.receiver === user.uid
                    ).map(([id, notification]) => ({ ...notification, id }));

                    setNotifications(userNotifications);
                }
            });
        }
    }, [user]);
    return (
        <AuthProvider>
            <Router>
                <PublicChat
                    handleSignOut={handleSignOut}/>
                <Switch
                    checked={isDarkTheme}
                    onChange={() => setIsDarkTheme(prev => !prev)}
                    checkedChildren="Светлая тема"
                    unCheckedChildren="Темная тема"
                    className={'switch'}
                />
                <div className="container">
                    <div className={`chat ${user ? "logged-in" : "not-logged-in"}`}>
                        <div className="chat-header">
                            <div className="title"><AliwangwangOutlined className="logo" />Conversa </div>
                            {user && <div className="current-user">Здравствуйте, {user.displayName}</div>}
                        </div>
                        {user ? (
                            <>

                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <div className="message-container">
                                                <MessageContainer
                                                    user={user}
                                                    setSelectedMessageId={setSelectedMessageId}
                                                    messages={messages}
                                                    usersData={usersData}
                                                />
                                            </div>
                                        }
                                    />
                                    <Route
                                        path="/private"
                                        element={
                                            <div className="message-container">
                                                <PrivateChat
                                                    messages={messages}
                                                    user={user}
                                                    selectedUser={selectedUser}
                                                    notifications={notifications}
                                                />
                                            </div>
                                        }
                                    />
                                </Routes>
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
                                <MessageForm
                                    onSubmit={onSubmit}
                                    message={message}
                                    setMessage={setMessage}
                                    onEmojiClick={onEmojiClick}
                                />
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
                     <div className={'button-fixed'}>
                         <Button
                             type="primary"
                             icon={<UserOutlined />}
                             size="large"
                             onClick={() => setIsUserListVisible(prev => !prev)}
                             style={{ position: 'fixed', right: '2px', top: '5px' }}
                         >
                             Пользователи
                         </Button>
                     </div>
                    )}
                    {user && (
                        <UserList
                            setSelectedUser={setSelectedUser}
                            enterPrivateChat={enterPrivateChat}
                            user={user}
                            setPrivateChatUser={setPrivateChatUser}
                            setIsPrivateChat={setIsPrivateChat}
                            isUserListVisible={isUserListVisible}
                            setIsUserListVisible={setIsUserListVisible}
                        />
                    )}
                </div>
            </Router>
        </AuthProvider>
    );

}

export default App;