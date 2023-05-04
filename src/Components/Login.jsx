import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { auth } from "./FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            setLoading(false);
        } catch (error) {
            console.error("Ошибка входа:", error);
            setLoading(false);
        }
    };

    return (
        <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item
                name="email"
                rules={[{ required: true, message: "Введите ваш адрес электронной почты!" }]}
            >
                <Input placeholder="Электронная почта" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: "Введите ваш пароль!" }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Войти
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Login;
