import {Link} from "react-router-dom";
import {Button} from "antd";

const PublicChat = (prop) => {
    return (
        <div className={'public'}>
            <div>
                <Link to="/">Общий чат</Link> | <Link to="/private">Личный диалог</Link>
            </div>
            <Button type="link" onClick={prop.handleSignOut}>
                Выйти
            </Button>
        </div>
    )
}

export default PublicChat