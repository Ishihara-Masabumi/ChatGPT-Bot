import React, { useState } from 'react';
import axios from 'axios';

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [...messages, userMessage],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ........`,
          },
        }
      );

      const botMessage = response.data.choices[0].message;
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Error fetching response:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ChatGPT React ChatBot</h1>
      <div className="border p-4 rounded h-96 overflow-y-auto mb-4 bg-white">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <p className="mb-2"><strong>{msg.role === 'user' ? 'You' : 'ChatGPT'}:</strong> {msg.content}</p>
          </div>
        ))}
        {loading && <p className="italic text-gray-500">ChatGPT is typing...</p>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="flex-grow p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
