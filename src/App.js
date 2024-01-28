import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatApp.css';  // Ensure this path correctly points to your CSS file

function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [user, setUser] = useState({}); // State for storing user data

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDataResponse = await axios.get('http://localhost:3000/userData');
                setUser(userDataResponse.data);
                // Add a greeting message with the user's name
                setMessages([{ user: 'Juancito', text: `Hola ${userDataResponse.data.name}, ¿cómo puedo ayudarte a aprender español hoy?` }]);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();


        const fetchInitialMessage = async () => {
            try {
                const response = await axios.get('http://localhost:3000/initialMessage');
                setMessages([{ user: 'Juancito', text: response.data.response }]);
            } catch (error) {
                console.error('Error fetching initial message:', error);
                // Optionally handle the error in the UI
            }
        };

        fetchInitialMessage();
    }, []);

    const sendMessage = async () => {
        try {
            const newMessage = { user: 'You', text: inputText };
    
            // Check if the greeting has already been sent in this conversation
            const greetingAlreadySent = messages.some(msg => msg.text.includes("¿cómo puedo ayudarte a aprender español hoy?"));
            
            // If this is the first message and no greeting has been sent, add the greeting
            if (messages.length === 0 && !greetingAlreadySent) {
                const greeting = { user: 'Juancito', text: `Hola ${user.name}, ¿cómo puedo ayudarte a aprender español hoy?` };
                setMessages([greeting, newMessage]);
            } else {
                setMessages([...messages, newMessage]);
            }
    
            const response = await axios.post('http://localhost:3000/juancito', { message: inputText });
            setMessages(prev => [...prev, { user: 'Juancito', text: response.data.response }]);
        } catch (error) {
            console.error('Error:', error);
        }
        setInputText('');
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };
    return (
        <div className="app-container">
            <div className="teacher-image">
                <img src="./juancito.png" alt="Juancito" />
                <div className="teacher-title">Juancito</div>
                
            </div>
            <div className="chat-container">
            <div className="user-info">
                <p>Username: {user.name}</p>
                <p>Language Level: {user.languageLevel}</p>
            </div>
                <div className="chat-box">
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <p key={index}><b>{msg.user}:</b> {msg.text}</p>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyPress={handleKeyPress} />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatApp;
