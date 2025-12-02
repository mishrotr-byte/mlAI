import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'; // UI как shadcn
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user, updateAvatar } = useAuth();
  const [searchHistory, setSearchHistory] = React.useState([]); // Загрузи из БД

  return (
    <div className="p-4">
      <Avatar className="w-24 h-24 mx-auto">
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
      <h2>{user.name}</h2>
      <input type="file" onChange={(e) => updateAvatar(e.target.files[0])} />
      <h3>История чатов</h3>
      <ul>{searchHistory.map((h, i) => <li key={i}>{h.content}</li>)}</ul>
      {/* Кнопка "Режим бога" для админа */}
      {user.isAdmin && <button>Модерация</button>}
    </div>
  );
}
