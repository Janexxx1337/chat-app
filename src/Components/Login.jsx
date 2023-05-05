import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "./FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import githubLogo from "../github-logo.svg";


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
