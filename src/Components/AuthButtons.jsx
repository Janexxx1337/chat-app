import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const AuthButtons = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className={"buttons"}>
            <Button
                type="primary"
                onClick={() => handleNavigation("/register")}
                style={{ marginRight: "1rem" }}
            >
                Регистрация
            </Button>
            <Button className={"exit"} type="primary" onClick={() => handleNavigation("/login")}>
                Вход
            </Button>
        </div>
    );
};

export default AuthButtons;
