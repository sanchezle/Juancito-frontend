import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatApp.css';  // Ensure this path correctly points to your CSS file

// API base URL
const API_BASE_URL = 'https://luis-dev-lab.com/projects/juancito';

function ChatApp() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [user, setUser] = useState({}); // State for storing user data
    const [context, setContext] = useState([]); // Context for chat history

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDataResponse = await axios.get(`${API_BASE_URL}/userData`);
                setUser(userDataResponse.data);
                // Add a greeting message with the user's name
                setMessages([{ user: 'Juancito', text: `Hola ${userDataResponse.data.name || 'amigo'}, ¿cómo puedo ayudarte a aprender español hoy?` }]);
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Set default user data if fetch fails
                setUser({ name: 'amigo', languageLevel: 'beginner' });
                setMessages([{ user: 'Juancito', text: `Hola amigo, ¿cómo puedo ayudarte a aprender español hoy?` }]);
            }
        };

        fetchUserData();
    }, []); // No dependencies for initial user data load

    useEffect(() => {
        // Only fetch initial message if no messages exist yet
        if (messages.length === 0) {
            const fetchInitialMessage = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/initialMessage`);
                    setMessages([{ user: 'Juancito', text: response.data.message }]);
                } catch (error) {
                    console.error('Error fetching initial message:', error);
                    // If this fails, the greeting from fetchUserData will remain
                }
            };
            
            fetchInitialMessage();
        }
    }, [messages.length]); // This is safe now because we only execute when messages.length === 0

    const sendMessage = async () => {
        if (!inputText.trim()) return; // Don't send empty messages
        
        try {
            const newMessage = { user: 'You', text: inputText };
    
            // Check if the greeting has already been sent in this conversation
            const greetingAlreadySent = messages.some(msg => msg.text.includes("¿cómo puedo ayudarte a aprender español hoy?"));
            
            // If this is the first message and no greeting has been sent, add the greeting
            if (messages.length === 0 && !greetingAlreadySent) {
                const greeting = { user: 'Juancito', text: `Hola ${user.name || 'amigo'}, ¿cómo puedo ayudarte a aprender español hoy?` };
                setMessages([greeting, newMessage]);
            } else {
                setMessages([...messages, newMessage]);
            }

            const updatedContext = [...context, { role: "user", content: inputText }];
    
            const response = await axios.post(`${API_BASE_URL}`, { message: inputText, context: updatedContext });
            setMessages(prev => [...prev, { user: 'Juancito', text: response.data.response }]);
            setContext(response.data.context); // Update context with the latest conversation history
        } catch (error) {
            console.error('Error sending message:', error);
            // Handle error in UI
            setMessages(prev => [...prev, { user: 'System', text: 'Error connecting to Juancito. Please try again later.' }]);
        }
        setInputText('');
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="app-container">
            <div className="teacher-image">
                <img src="/juancito.png" alt="Juancito" />
                <div className="teacher-title">Juancito</div>
            </div>
            <div className="chat-container">
                <div className="user-info">
                    <p>Username: {user.name || 'Guest'}</p>
                    <p>Language Level: {user.languageLevel || 'Not specified'}</p>
                </div>
                <div className="chat-box">
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <p key={index}><b>{msg.user}:</b> {msg.text}</p>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input 
                            type="text" 
                            value={inputText} 
                            onChange={e => setInputText(e.target.value)} 
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message here..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatApp;
