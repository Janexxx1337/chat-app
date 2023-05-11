import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {Button} from "antd";

const AuthButtons = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };
    const [user, setUser] = useState(null);
    return (
        <div className={`chat ${user ? "logged-in" : "not-logged-in"}`}>
            <div className={"buttons"}>
                <Button
                    type="primary"
                    onClick={() => handleNavigation("/register")}
                >
                    Регистрация
                </Button>
                <Button className={"exit"} type="primary" onClick={() => handleNavigation("/login")}>
                    Вход
                </Button>
            </div>
        </div>

    );
};


export default AuthButtons