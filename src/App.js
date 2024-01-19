import React, { useState } from 'react';
import axios from 'axios';
import './ChatApp.css';  // Ensure this path correctly points to your CSS file

function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const sendMessage = async () => {
        try {
            const response = await axios.post(' https://juancito-f43f3b2f8207.herokuapp.com/juancito', { message: inputText });
            setMessages([...messages, { user: 'You', text: inputText }, { user: 'Bot', text: response.data.response }]);
        } catch (error) {
            console.error('Error:', error);
            // Optionally handle the error in the UI
        }
        setInputText('');
    };

    return (
        <div className="app-container"> {/* New container for layout */}
            <div className="teacher-image">
                <img src="./juancito.png" alt="Juancito" />
            </div>
            <div className="chat-container">
                <div className="chat-box">
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <p key={index}><b>{msg.user}:</b> {msg.text}</p>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatApp;
