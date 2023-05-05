import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { auth, database } from "./FirebaseConfig";
import { ref, set } from "firebase/database";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
            const user = userCredential.user;

            await updateProfile(user, { displayName: values.username });

            const userRef = ref(database, `users/${user.uid}`);
            set(userRef, {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
            });

            message.success("Вы успешно зарегистрировались!");
            navigate("/");
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            message.error("Ошибка регистрации, пожалуйста, попробуйте еще раз.");
        }
    };

    return (
        <Form name="register" onFinish={onFinish} autoComplete="off">
            <Form.Item
                name="username"
                rules={[{ required: true, message: "Введите ваше имя пользователя!" }]}
            >
                <Input prefix={<UserOutlined />} placeholder="Имя пользователя" />
            </Form.Item>
            <Form.Item
                name="email"
                rules={[{ required: true, message: "Введите ваш адрес электронной почты!" }]}
            >
                <Input prefix={<MailOutlined />} placeholder="Электронная почта" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: "Введите ваш пароль!" }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Зарегистрироваться
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Register;
