import {useNavigate} from "react-router-dom";
import {Button} from "antd";

const AuthButtons = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };
    return (
        <>
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
        </>

    );
};


export default AuthButtons