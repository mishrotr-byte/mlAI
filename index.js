import React from 'next/app';
import Chatbot from '../src/components/Chatbot';
import Games from '../src/components/Games';
import Profile from '../src/components/Profile';
import RegistrationFlow from '../src/components/RegistrationFlow';
import TelegramWidget from '../src/components/TelegramWidget';
import { useState } from 'react';

function Home() {
  const [tab, setTab] = useState('chat');
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="p-4 flex space-x-4">
        <button onClick={() => setTab('chat')}>ИИ Чат</button>
        <button onClick={() => setTab('games')}>Игры</button>
        <button onClick={() => setTab('profile')}>Профиль</button>
        <button onClick={() => setTab('register')}>Регистрация</button>
      </nav>
      {tab === 'chat' && <Chatbot user={user} />}
      {tab === 'games' && <Games />}
      {tab === 'profile' && <Profile />}
      {tab === 'register' && <RegistrationFlow onRegister={setUser} />}
      <TelegramWidget />
    </div>
  );
}

export default Home;
