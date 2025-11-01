import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

// Simple mock responses for the chatbot
const CHATBOT_RESPONSES: Record<string, string[]> = {
  default: [
    "Hello! I'm your eco-tourism assistant. How can I help you today?",
    "Feel free to ask me about sustainable travel tips or local eco-friendly practices.",
  ],
  greetings: [
    "Hi! How can I assist you with sustainable tourism today?",
    "Hello! Looking for eco-friendly travel advice?",
    "Welcome! I can help you discover sustainable travel options.",
  ],
  sustainability: [
    "Here are some eco-friendly travel tips:\n1. Use public transport\n2. Carry a reusable water bottle\n3. Support local businesses\n4. Minimize waste\n5. Respect local environments",
    "Consider staying at hostels with high eco-scores - they actively implement sustainable practices!",
    "Look for hostels that use renewable energy and practice water conservation.",
  ],
  activities: [
    "Many of our hostels offer great eco-friendly activities like:\n- Beach cleanups\n- Local farming workshops\n- Renewable energy tours\n- Conservation projects",
    "You can join community activities at most eco-hostels - it's a great way to learn about local sustainability practices!",
  ],
};

function getResponse(message: string): string {
  const lowercaseMsg = message.toLowerCase();
  
  if (lowercaseMsg.includes('hi') || lowercaseMsg.includes('hello') || lowercaseMsg.includes('hey')) {
    return CHATBOT_RESPONSES.greetings[Math.floor(Math.random() * CHATBOT_RESPONSES.greetings.length)];
  }
  
  if (lowercaseMsg.includes('sustainable') || lowercaseMsg.includes('eco') || lowercaseMsg.includes('green')) {
    return CHATBOT_RESPONSES.sustainability[Math.floor(Math.random() * CHATBOT_RESPONSES.sustainability.length)];
  }
  
  if (lowercaseMsg.includes('activity') || lowercaseMsg.includes('activities') || lowercaseMsg.includes('do')) {
    return CHATBOT_RESPONSES.activities[Math.floor(Math.random() * CHATBOT_RESPONSES.activities.length)];
  }
  
  return CHATBOT_RESPONSES.default[Math.floor(Math.random() * CHATBOT_RESPONSES.default.length)];
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm your eco-tourism assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate typing delay for bot response
    setTimeout(() => {
      const botMessage = { id: Date.now() + 1, text: getResponse(input), isUser: false };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <MessageCircle className="w-5 h-5 text-green-500 mr-2" />
          <h3 className="text-lg font-medium">Eco-Tourism Assistant</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="p-2 text-white bg-green-500 rounded-full hover:bg-green-600"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatBot;