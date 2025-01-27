import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/messages');  // Call backend API
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const addMessage = async () => {
    if (newMessage.trim()) {
      try {
        await axios.post('/api/messages', { message: newMessage });
        setNewMessage('');
        fetchMessages();
      } catch (error) {
        console.error("Error adding message:", error);
      }
    }
  };

  useEffect(() => {
    fetchMessages();  // Fetch messages when the component mounts
  }, []);

  return (
    <div>
      <h1>Message Board</h1>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Write a message"
      />
      <button onClick={addMessage}>Submit</button>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>{msg.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
