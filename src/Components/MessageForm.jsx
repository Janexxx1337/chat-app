import {Button, Input} from "antd";
import EmojiPicker from "./EmojiPicker";
import {SendOutlined} from "@ant-design/icons";
import React from "react";

const MessageForm = (prop) => {
    return (
        <>
            <form onSubmit={prop.onSubmit} className="input-form">
                <Input
                    placeholder="Введите сообщение"
                    value={prop.message}
                    onChange={(e) => prop.setMessage(e.target.value)}
                    style={{width: "100%"}}
                />
                <EmojiPicker onEmojiClick={prop.onEmojiClick} />
                <Button type="primary" htmlType="submit" icon={<SendOutlined/>}>
                    Отправить
                </Button>
            </form>
        </>
    )
}

export default MessageForm