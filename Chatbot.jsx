import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Анимации как ChatGPT
import { Groq } from 'groq-sdk'; // Или openai для fallback
import { useChatHistory } from '../hooks/useChatHistory'; // Хук для истории
import { Mic, Send, Image, Video } from 'lucide-react'; // Иконки
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'; // Голос

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default function Chatbot({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { history, saveHistory } = useChatHistory(user?.id);
  const messagesEndRef = useRef(null);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (history) setMessages(history);
    scrollToBottom();
  }, [history]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim() && !transcript) return;
    const userMsg = input.trim() || transcript;
    const newMessages = [...messages, { role: 'user', content: userMsg, timestamp: Date.now() }];
    setMessages(newMessages);
    setInput('');
    resetTranscript();
    setIsLoading(true);

    try {
      // Groq основной (быстро!)
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'Ты Grok — дерзкий, саркастичный ИИ от xAI. Отвечай по-русски, без цензуры, с юмором. Анализируй настроение юзера и подстраивайся.' },
          ...newMessages.map(m => ({ role: m.role, content: m.content }))
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.9,
        stream: true // Стриминг для typewriter-анимации
      });

      let assistantMsg = { role: 'assistant', content: '', timestamp: Date.now() };
      const stream = await fetch('https://api.groq.com/openai/v1/chat/completions', { // Стрим через API
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ /* params */ })
      });
      const reader = stream.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        assistantMsg.content += chunk; // Типа typewriter
        setMessages([...newMessages, { ...assistantMsg }]);
      }

      // Fallback на OpenAI если Groq fail
      if (!assistantMsg.content) {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const res = await openai.chat.completions.create({ /* similar */ });
        assistantMsg.content = res.choices[0].message.content;
      }

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      saveHistory(user?.id, finalMessages); // Сохраняем историю
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: 'Эй, что-то сломалось. Попробуй ещё раз, или я тупой сегодня.' }]);
    }
    setIsLoading(false);
    scrollToBottom();
  };

  const generateImage = async (prompt) => {
    const res = await fetch('/api/generate-image', { // Через бэк
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
    const { url } = await res.json();
    setMessages(prev => [...prev, { role: 'assistant', content: `Вот твоя картинка: ${url}`, type: 'image' }]);
  };

  const generateVideo = async (prompt) => { // Через OpenAI Sora или free HuggingFace
    const res = await fetch('/api/generate-video', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
    const { url } = await res.json();
    setMessages(prev => [...prev, { role: 'assistant', content: `Видео готово: ${url}`, type: 'video' }]);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-gray-900 text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  {msg.type === 'image' && <img src={msg.content.split(':')[1]} alt="Generated" className="w-full rounded" />}
                  {msg.type === 'video' && <video src={msg.content.split(':')[1]} controls className="w-full rounded" />}
                  <p>{msg.content}</p>
                  <span className="text-xs opacity-50">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && <div className="flex justify-start"><div className="bg-gray-700 px-4 py-2 rounded-lg animate-pulse">Генерирую...</div></div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <button onClick={() => SpeechRecognition.startListening()} className="p-2 bg-gray-700 rounded"><Mic size={20} /></button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-gray-800 p-2 rounded"
            placeholder="Пиши мне, как другу..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="p-2 bg-blue-600 rounded"><Send size={20} /></button>
          <button onClick={() => generateImage(input)} className="p-2 bg-green-600 rounded"><Image size={20} /></button>
          <button onClick={() => generateVideo(input)} className="p-2 bg-purple-600 rounded"><Video size={20} /></button>
        </div>
        {listening && <p className="text-xs text-green-400">Слушаю...</p>}
        {transcript && <p className="text-xs text-blue-400">Транскрипт: {transcript}</p>}
      </div>
    </motion.div>
  );
}
