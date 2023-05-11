import { SmileOutlined, HeartOutlined, LikeOutlined } from '@ant-design/icons';


function EmojiPicker({ onEmojiClick }) {
    const emojis = [
        { component: <SmileOutlined />, key: '😜' },
        { component: <HeartOutlined />, key: '😍' },
        { component: <LikeOutlined />, key: '😂' },
    ];

    return (
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
            {emojis.map((emoji, index) => (
                <div key={index} onClick={() => onEmojiClick(emoji.key)}>
                    {emoji.component}
                </div>
            ))}
        </div>
    );
}

export default EmojiPicker;
