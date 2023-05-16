import { useState, useEffect } from 'react';
import { onValue, ref, child, update } from 'firebase/database';


export function useMessages(user, isPrivateChat, prop) {
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState({});

    useEffect(() => {
        const messagesRef = ref(prop.database, "messages");
        onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const mappedData = Object.entries(data).map(([id, value]) => ({...value, id}));
                setMessages(mappedData);

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

    return { messages, notifications };
}
