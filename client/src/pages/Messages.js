import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const socket = io('http://localhost:5000');

function Messages() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      socket.emit('join', user.id);
      axios.get(`http://localhost:5000/api/messages/${userId}`)
        .then(res => setMessages(res.data))
        .catch(err => {
          console.error('Fetch messages error:', err.response?.data?.msg);
          setError('Failed to load messages');
        });

      socket.on('receiveMessage', (msg) => {
        if (msg.sender === userId || msg.recipient === userId) {
          setMessages(prev => [...prev, msg]);
        }
      });

      return () => socket.off('receiveMessage');
    }
  }, [user, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = { sender: user.id, recipient: userId, content: newMessage };
    try {
      await axios.post('http://localhost:5000/api/messages', {
        recipient: userId,
        content: newMessage,
      });
      socket.emit('sendMessage', message);
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (err) {
      console.error('Send message error:', err.response?.data?.msg);
      setError('Failed to send message');
    }
  };

  if (!user) return <p className="text-red-500">Please log in to chat.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="border rounded-lg p-4 h-96 overflow-y-auto mb-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.sender === user.id ? 'text-right' : 'text-left'}`}
          >
            <p
              className={`inline-block p-2 rounded-lg ${
                msg.sender === user.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {msg.content}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border p-2 rounded-l focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
export default Messages;