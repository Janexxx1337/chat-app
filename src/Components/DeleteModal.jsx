import { Modal, Button } from 'antd';


const DeleteModal = ({ message, visible, onCancel, onConfirm }) => {


    return (
        <Modal
            visible={visible}
            title="Удалить сообщение"
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Отмена
                </Button>,
                <Button
                    key="delete"
                    type="primary"
                    onClick={() => onConfirm(message.id)}
                >
                    Удалить
                </Button>


                ,
            ]}
        >
            <p>Вы уверены, что хотите удалить это сообщение?</p>
            <p>{message.senderName}: {message.text}</p>
        </Modal>
    );
};

export default DeleteModal