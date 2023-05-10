import React from 'react';
import { ref, child, remove } from "firebase/database";
import DeleteModal from "./DeleteModal";

const DeleteModalHandler = ({ selectedMessageId, messages, setSelectedMessageId, database }) => {
    return (
        selectedMessageId && (
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
        )
    );
};

export default DeleteModalHandler;
