import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { signInWithPopup, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import githubLogo from "../images/github-logo.svg";
import googleLogo from '../images/google.svg'
import { getDatabase, ref, set, get, child } from "firebase/database";

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
            await signInWithPopup(auth, provider);
            message.success("Вы успешно вошли с помощью аккаунта GitHub!");
            navigate("/");
        } catch (error) {
            console.error("Ошибка входа с аккаунтом GitHub:", error);
            message.error("Ошибка входа с аккаунтом GitHub, пожалуйста, попробуйте еще раз.");
        }
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Get database instance
            const db = getDatabase();

            // Check if user exists in database
            const userRef = ref(db, 'users/' + user.uid);
            get(userRef).then((snapshot) => {
                if (!snapshot.exists()) {
                    // User does not exist, add to database
                    set(userRef, {
                        username: user.displayName,
                        email: user.email,
                    });
                }
            });

            message.success("Вы успешно вошли с помощью аккаунта Google!");
            navigate("/");
        } catch (error) {
            console.error("Ошибка входа с аккаунтом Google:", error);
            message.error("Ошибка входа с аккаунтом Google, пожалуйста, попробуйте еще раз.");
        }
    };



    return (
        <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
        >
            <Button style={{marginBottom: '20px'}} className="github-button" onClick={signInWithGithub}>
                <img src={githubLogo} alt="GitHub Logo" width="20" />
                Войти с помощью GitHub
            </Button>
            <Button style={{marginBottom: '20px'}} className="google-button" onClick={signInWithGoogle}>
                <img src={googleLogo} alt="google-logo" width="20"/>
                Войти с помощью Google
            </Button>


            <Form.Item
                name="email"
                rules={[{ required: true, message: "Пожалуйста, введите вашу электронную почту!" }]}
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
                <Button type="primary" htmlType="submit" loading={loading}>
                    Войти
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Login;