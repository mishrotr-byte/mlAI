import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Games() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const aiMove = async () => {
    // Groq для AI хода (простой prompt)
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: `Сделай ход в Tic-Tac-Toe на доске ${board}. Твой символ O.` }],
      model: 'llama-3.1-8b-instant'
    });
    const move = parseInt(completion.choices[0].message.content); // Парсим
    if (board[move] === null) setBoard(prev => { prev[move] = 'O'; return [...prev]; });
  };

  const handleClick = (i) => {
    if (board[i] || calculateWinner(board)) return;
    setBoard(prev => { prev[i] = isXNext ? 'X' : 'O'; return [...prev]; });
    setIsXNext(!isXNext);
    if (!isXNext) aiMove(); // AI ход
  };

  return (
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="grid grid-cols-3 gap-2 p-4">
      {board.map((cell, i) => (
        <button key={i} onClick={() => handleClick(i)} className="w-20 h-20 bg-gray-700 rounded text-2xl">
          {cell}
        </button>
      ))}
      {/* Добавь квесты: "Сыграй 3 раза — получи AI-арт бесплатно" */}
      <p>Ежедневный квест: Выиграй у AI!</p>
    </motion.div>
  );
}

function calculateWinner(squares) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
}
