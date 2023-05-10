import React from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from "@ant-design/icons";

const MessageForm = ({ message, setMessage, onSubmit }) => {
    return (
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
    );
};

export default MessageForm;
