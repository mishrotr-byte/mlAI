import { useState, useEffect } from 'react';

export function useChatHistory(userId) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (userId) {
      fetch(`/api/history/${userId}`).then(res => res.json()).then(setHistory);
    }
  }, [userId]);

  const saveHistory = async (id, msgs) => {
    await fetch(`/api/history/${id}`, { method: 'POST', body: JSON.stringify(msgs) });
    setHistory(msgs);
  };

  return { history, saveHistory };
}
