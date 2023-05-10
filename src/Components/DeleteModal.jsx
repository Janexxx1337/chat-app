import { Modal, Button } from 'antd';
import { useState } from 'react';

const DeleteModal = ({ message, onCancel, onConfirm }) => {
    const [visible, setVisible] = useState(true);

    const handleClose = () => {
        onCancel();
        setVisible(false);
    };

    const handleConfirm = () => {
        onConfirm(message.id);
        setVisible(false);
    };

    return (
        message && (
            <Modal
                open={visible}
                title="Удалить сообщение"
                onCancel={handleClose}
                footer={[
                    <Button key="cancel" onClick={handleClose}>
                        Отмена
                    </Button>,
                    <Button
                        key="delete"
                        type="primary"
                        onClick={handleConfirm}
                    >
                        Удалить
                    </Button>
                ]}
            >
                <p>Вы уверены, что хотите удалить это сообщение?</p>
                <p>{message.senderName}: {message.text}</p>
            </Modal>
        )
    );
}

export default DeleteModal;
