import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth, database } from "./FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import githubLogo from "../images/github-logo.svg";
import { GoogleAuthProvider } from "firebase/auth";
import googleLogo from '../images/google.svg';
import { ref, child, update } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

const Login = () => {
    const navigate = useNavigate();
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


    const signInWithGithub = async () => {
        const provider = new GithubAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const { user } = result;
            const uniqueUsername = `GithubUser${uuidv4()}`; // Генерация уникального имени пользователя

            const usersRef = ref(database, "users");
            const userRef = child(usersRef, user.uid);
            update(userRef, { uid: user.uid, username: uniqueUsername, displayName: user.displayName });

            message.success("Вы успешно вошли с помощью аккаунта GitHub!");
            navigate("/");
        } catch (error) {
            console.error("Ошибка входа с аккаунтом GitHub:", error);
            message.error(
                "Ошибка входа с аккаунтом GitHub, пожалуйста, попробуйте еще раз."
            );
        }
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const { user } = result;
            const uniqueUsername = `GoogleUser${uuidv4()}`; // Генерация уникального имени пользователя

            const usersRef = ref(database, "users");
            const userRef = child(usersRef, user.uid);
            update(userRef, { uid: user.uid, username: uniqueUsername, displayName: user.displayName });

            message.success("Вы успешно вошли с помощью аккаунта Google!");
            navigate("/");
        } catch (error) {
            console.error("Ошибка входа с аккаунтом Google:", error);
            message.error(
                "Ошибка входа с аккаунтом Google, пожалуйста, попробуйте еще раз."
            );
        }
    };



    return (
        <Form name="login" onFinish={onFinish} autoComplete="off">
            <Button
                style={{ marginBottom: "20px" }}
                className="github-button"
                onClick={signInWithGithub}
            >
                <img src={githubLogo} alt="GitHub Logo" width="20" />
                Войти с помощью GitHub
            </Button>
            <Button
                style={{ marginBottom: "20px" }}
                className="google-button"
                onClick={signInWithGoogle}
            >
                <img src={googleLogo} alt="google-logo" width="20" />
                Войти с помощью Google
            </Button>

            <Form.Item
                name="email"
                rules={[
                    { required: true, message: "Пожалуйста, введите вашу электронную почту!" },
                ]}
            >
                <
                    Input prefix={<MailOutlined />} placeholder="Электронная почта" />
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