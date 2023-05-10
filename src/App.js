import React, { useState, useEffect } from 'react';
import { Layout, Spin } from 'antd';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirebaseAuth } from "./Components/FirebaseConfig";
import MessageForm from "./Components/MessageForm";
import MessageList from "./Components/MessageList";
import './App.css';

const { Header, Content } = Layout;

function App() {
    const [user, loading, error] = useAuthState(getFirebaseAuth());
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Load messages from Firebase
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        // Send message to Firebase
    };

    const handleDelete = (messageId) => {
        // Delete message from Firebase
    };

    if (loading) {
        return <Spin />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Layout className="layout">
            <Header>Chat Application</Header>
            <Content>
                <MessageList
                    messages={messages}
                    user={user}
                    handleDelete={handleDelete}
                />
                <MessageForm
                    message={message}
                    setMessage={setMessage}
                    onSubmit={onSubmit}
                />
            </Content>
        </Layout>
    );
}

export default App;
