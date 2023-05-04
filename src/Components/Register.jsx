import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { auth, database } from "./FirebaseConfig";
import { ref, set } from "firebase/database";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
            const user = userCredential.user;

            // Здесь мы обновляем информацию о пользователе с именем, которое указал пользователь при регистрации
            await updateProfile(user, { displayName: values.username });

            // Запись пользователя в базу данных
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
        setLoading(false);
    };

    return (
        <Form
            name="register"
            onFinish={onFinish}
            autoComplete="off"
        >
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
                    Зарегистрироваться
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Register;
